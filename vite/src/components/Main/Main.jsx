import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import socket from "../../socket";
import { useNavigate } from "react-router-dom";

//

const Main = () => {
  const roomRef = useRef();
  const userRef = useRef();
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  let puter = window.puter;

  const [username, setUserName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    console.log("useEffect Name");
    const getUserName = async () => {
      console.log("getUserName");
      const isSignedIn = puter.auth.isSignedIn();
      if (!isSignedIn) {
        puter.auth.signIn();
      }
      console.log("Signed in");
      const theUser = await puter.auth.getUser();
      sessionStorage.setItem("user", theUser.username);
      console.log(theUser.username);
      setUserName(theUser.username);
    };
    getUserName();
  }, []);

  useEffect(() => {
    socket.on("FE-error-user-exist", ({ error }) => {
      if (!error) {
        const roomName = roomRef.current.value;
        const isSignedIn = puter.auth.isSignedIn();
        if (!isSignedIn) {
          puter.auth.signIn();
        }
        console.log("Signed in");
        puter.auth.getUser().then((theUser) => {
          console.log("Set session user: ", theUser.username)
          sessionStorage.setItem("user", theUser.username);

        })

        
        // props.history.push(`/room/${roomName}`); since we are using react-router-dom v6, we need to use the navigate function
        navigate(`/room/${roomName}`);
      } else {
        setErr(error);
        setErrMsg("User name already exist");
      }
    });
  }, []);

  function clickJoin() {
    const roomName = roomRef.current.value;
    const userName=username;
    console.log("roomName: ", roomName);
    console.log("userName: ", userName);
    
    if (!roomName || !userName) {
      setErr(true);
      setErrMsg("Enter Room Name or User Name");
    } else {
      socket.emit("BE-check-user", { roomId: roomName, userName });
      console.log("BE-check-user: ", { roomId: roomName, userName });
    }
  }

  return (
    <MainContainer>
      <Row>
        <Label htmlFor="roomName">Room Name</Label>
        <Input type="text" id="roomName" ref={roomRef} />
      </Row>
      <JoinButton onClick={clickJoin}> Join as {username}</JoinButton>
      {err ? <Error>{errMsg}</Error> : null}
    </MainContainer>
  );
};

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 15px;
  line-height: 35px;
`;

const Label = styled.label``;

const Input = styled.input`
  width: 150px;
  height: 35px;
  margin-left: 15px;
  padding-left: 10px;
  outline: none;
  border: none;
  border-radius: 5px;
`;

const Error = styled.div`
  margin-top: 10px;
  font-size: 20px;
  color: #e85a71;
`;

const JoinButton = styled.button`
  height: 40px;
  margin-top: 35px;
  outline: none;
  border: none;
  border-radius: 15px;
  color: #d8e9ef;
  background-color: #4ea1d3;
  font-size: 25px;
  font-weight: 500;

  :hover {
    background-color: #7bb1d1;
    cursor: pointer;
  }
`;

export default Main;
