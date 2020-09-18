const charRegEx = /^[A-Za-z]+$/;//validates for alphabetic characters only
const emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*)@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]+)\])/;
const stringRegEx = /^([a-zA-Z0-9_.-\s])+$/;
const usernameRegEx = /^([a-zA-Z0-9_.-])+$/;

const InputValidationHelper = {
    validateChar: (str) => {
        return charRegEx.test(str);
    },
    validateUsername: (str) => {
        return usernameRegEx.test(str);
    },
    validateString: (str) =>{
        return stringRegEx.test(str);
    },
    validateEmail: (str) => {
        return emailRegex.test(str);
    },
    validatePassword: (str) => {
        if(str.length < 8){
            return false;
        }

        return true;
    },
    validatePasswords: (str1, str2) => {
        console.log(str1, str2);
        if(str1 !== str2){
            return false;
        }

        return true;
    },
    encodeHTML: (s) => {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    },
}

export default InputValidationHelper;