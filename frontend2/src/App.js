import React, {useEffect, useState} from 'react'
import axios from 'axios'

const App = () => {
  const [users, setUsers] = useState([])
  const getData = async() => {
    const res = await axios.get('/api/users')
    setUsers(res.data)
  }

  useEffect(() => {
    getData()
  }, [])
 
  return (
    <div>
      {users.map(u => <h4 key={u._id}>userName : {u.userName}</h4>)}
      Username:
      <input name="userName" type="text" id="userName" size="30"></input>
      <input type="submit" name="Submit" value="Submit"></input>
    </div>
  )
}

export default App