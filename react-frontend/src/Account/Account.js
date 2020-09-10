import React, { useEffect, useContext, useState } from 'react';
import './Account.css';
import UserContext from "../UserContext";
import { useQuery } from '@apollo/client';
import MapHelper from '../Helpers/MapHelper';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { useMutation } from '@apollo/client';

function EditMapModal({mapName, handleNameEdit, ...props}){
  return (
      <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
      >
          <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                  Set Map Name
              </Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <form className="editmap">
                  <div className="form-group">
                      <label htmlFor="mapname">Map Name</label>
                      <input type="mapname" className="form-control" id="mapname" aria-describedby="mapNameHelp" type="text" defaultValue={ mapName } placeholder="Unamed"/>
                  </div>
              </form>
          </Modal.Body>
          <Modal.Footer>
              <button onClick={() => handleNameEdit(document.getElementsByClassName("editmap")[0][0].value)}>Save Name</button>
          </Modal.Footer>
      </Modal>
  );
}

function  EditMapName({map, user, refetch, ...props}){
  const [modalShow, setModalShow] = React.useState(false);
  const [editMap, { error: editMapError, loading, data: editMapData }] = useMutation(MapHelper.editMap);
   
  useEffect(() => {
    if(editMapError){
      console.log(editMapError);
    }
    
    if(editMapData){
      console.log(editMapData);
      refetch();
    }
  }, [editMapError, editMapData, refetch])

  const handleShow = () => {
      setModalShow(true);
  }

  const handleClose = () => {
      setModalShow(false);
  }

  const handleNameEdit = (mapName) => {
    handleClose();
    
    console.log(user.username, map.name, mapName, map)
    editMap({
      variables: {
        username: user.username,
        mapNameOrig: map.name,
        mapNameEdit: mapName,
        map: map.map
      }
    })
  }

  return (
      <>
          { loading &&
            <button disabled={true} onClick={() => handleShow()} className="btn btn-primary">Saving...</button>
          }

          { !loading &&
            <button onClick={() => handleShow()} className="btn btn-primary">Edit Name</button>
          }        

          <EditMapModal
              show={modalShow}
              handleNameEdit={(mapName) => handleNameEdit(mapName)}
              mapName={map.name}
              onHide={() => handleClose()}
          />
      </>
  );
}

function Account() {
  const {user} = useContext(UserContext);
  const { error: mapsError, data: mapsData, refetch: mapsRefetch} = useQuery(MapHelper.getUsersMaps, {
    variables: {
      username: user.username
    }
  }); //{ fetchPolicy: "network-only" }
  const [deleteMap, { error: deleteMapError, loading: deleteMapLoading, data: deleteMapData }] = useMutation(MapHelper.deleteMap);

  const [maps, setMaps] = useState(); 

  useEffect(() => {
    if(mapsError){
      console.log(mapsError);
    }

    if(mapsData){
      console.log(mapsData.getUsersMaps);

      setMaps((maps) => {
        return mapsData.getUsersMaps;
      })
    }
  }, [user, mapsError, mapsData]);

  useEffect(() => {
    if(deleteMapError){
      console.log(deleteMapError);
    }

    if(deleteMapData){
      console.log(deleteMapData);

      mapsRefetch();
    }
  }, [user, deleteMapError, deleteMapData, mapsRefetch]);

  return (
    <div id="account">
      {user &&
        <h1>{user.username}</h1>
      }
      <div className="links-container">
      {maps && 
        maps.map((map, index) => {
          return (
              <div className="link-container" key={index}>
                <div className="map-preview">
                  Map Preview
                </div>
                <div className="map-info">
                  <Link to={{pathname: "/sandbox", state: { userMap: map.map, mapName: map.name }}}>
                    <div>
                        <h3>{map.name}</h3>
                    </div>
                  </Link>
                </div>
                { user.username === map.owner &&
                  <div className="map-edit">
                    { user &&
                      <EditMapName 
                        user={user}
                        map={map}
                        refetch={mapsRefetch}
                      />
                    }
                    <Link to={{pathname: "/sandbox", state: { userMap: map.map, mapName: map.name }}}>
                      <button className="btn btn-primary">
                        Edit Map
                      </button>
                    </Link>

                      <button className="btn btn-danger" onClick={() => {
                        deleteMap({
                          variables: {
                            username: user.username,
                            mapName: map.name
                          }
                        })
                      }}>Delete Map</button>


                    {/* {deleteMapLoading &&
                      <button disabled={true} className="btn btn-danger">Deleting Map...</button>
                    } */}
                  </div>
                }
              </div>            
            )
          })
        }
      </div>
    </div>
  );
}

export default Account;