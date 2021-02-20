import './App.css';
import React,{useEffect, useState, useCallback } from "react";
import axios from 'axios';
import {useDropzone} from 'react-dropzone'


const UserProfile = () => {

  const [userProfiles, setUserProfiles] = useState([]);

  const fetchUserProfiles = () => {
    axios.get("http://localhost:8080/app/user/all")
    .then(
      resp => setUserProfiles(resp.data)
    );
  }

  useEffect(() => {
    fetchUserProfiles();
  },[]);

  return userProfiles.map((userProfile, index) => {
    return (
      <div key={index}>
        {userProfile.userProfileId ? 
          <img src={`http://localhost:8080/app/user/${userProfile.userProfileId}/image/download`}/>
           : 
          null
        }
        <br/>
        <br/>
        <h1>{userProfile.userName}</h1>
        <p>{userProfile.userProfileId}</p>
        <MyDropzone userProfileId={userProfile.userProfileId}/>
        <br/>
      </div>
    )
  })

}

function MyDropzone({userProfileId}) {
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    const file = acceptedFiles[0];
    const formData = new FormData(); 

    formData.append("file", file);

    axios.post(`http://localhost:8080/app/user/${userProfileId}/image/upload`, formData, {
      headers: {
        "Content-Type" : "multipart/form-data"
      }
    }).then(() => {
      console.log("File uploaded successfully!")
    }).catch(err => {
      console.log("Error occurred: ",err)
    });

  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop a profile picture here, or click to select an image</p>
      }
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <UserProfile/>
    </div>
  );
}

export default App;
