import { useEffect, useState } from 'react';
import './App.css';
import Axios from 'axios';

function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [listOfFriends, setListOfFriends] = useState([]);
  
  const addFriend = () => {
    Axios.post('http://localhost:3001/addFriend', {
      name, age
      }
    ).then((response) => {
      setListOfFriends([
        ...listOfFriends, 
        {_id: response.data._id,
          name,
          age,
        },
      ]); 
      console.log('Friend added');
    });
  }

  const updateFriend = (id) => {
    const newAge = prompt("Enter new Age : ")
    console.log('===> newAge : ', newAge);
    Axios.put('http://localhost:3001/update', {
      newAge: newAge,
      id: id,
    })
    .then(() => {
      setListOfFriends(
        listOfFriends.map((friend) => {
          return friend._id == id
                 ? {_id: id, name:friend.name, age:newAge}
                 : friend;
        })
      );
    });
  }

  const deleteFriend = (id) => {
    Axios.delete(`http://localhost:3001/delete/${id}`).then(
      () => {
        setListOfFriends(
          listOfFriends.filter((val) => {
            return val._id != id;
          })
        );
      }
    );
  };

  useEffect(() => {
    Axios.get('http://localhost:3001/read')
      .then((response) => {
        setListOfFriends(() => { return response.data });
      })
      .catch(() => {
        console.log(" Fetch list of Friends Error")
      })
  }, []);


  return (
    <div className="App">
      <div className="inputs">
        <input 
          type="text" 
          placeholder='Friend name...' 
          onChange={(event) => {
            setName(() => {
              return event.target.value
              }
            )
          }}
        />
        <input 
          type="number" 
          placeholder='Friend age...' 
          onChange={(event) => {
            setAge(() => {
              return event.target.value
              }
            )
          }}
        />
        <button onClick={addFriend}>Add Friend</button>
      </div>
      <div className="listOfFriends">
        {listOfFriends.map((friend,index) => (
          <div key={index} className="friendContainer">
            <div className="friend">
              <h3>Name: {friend.name}</h3>
              <h3>Age: {friend.age}</h3>
            </div>
            <div className="buttonWrap">
              <button onClick={() => updateFriend(friend._id)}>Update</button>
              <button onClick={() => deleteFriend(friend._id)}>X</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
