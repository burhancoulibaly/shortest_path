import React, { useEffect, useContext, useState } from 'react';
import './Account.css';
import UserContext from "../UserContext";
import { useQuery } from '@apollo/client';
import MapHelper from '../Helpers/MapHelper';
import { Link } from 'react-router-dom';

function Account() {
  const {user} = useContext(UserContext);
  const { error: mapsError, data: mapsData } = useQuery(MapHelper.getUsersMaps, {
    variables: {
      username: user.username
    }
  }); //{ fetchPolicy: "network-only" }
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

  return (
    <div id="account">
      {user &&
        <h1>{user.username}</h1>
      }

      {maps && 
        maps.map((map, index) => {
          return (
            <Link key={index} to={{pathname: "/sandbox", state: { userMap: map.map, mapName: map.name }}}>
              <div>
                  <h3>{map.name}</h3>
              </div>
            </Link>
          )
        })
      }
    </div>
  );
}

export default Account;