import "./App.css";
import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

//Sending signup data to backend
  async function registerUser(event){
    event.preventDefault()
    const response = await fetch("https://medico-sfh1.onrender.com/api/register",{
      method:"POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    })
  
    const data = await response.json()
    console.log(data)
    if(data.user==="ok"){
      window.location.href = "/login"
    }
    else{
      alert("Registeration failed")
    }
    
  }

  return (
    <>

    {/* registration part start here  */}
      <div className="register">

        {/* Login heading  here  */}
        <h1 className="login">REGISTER</h1>  

        {/* form starts here  */}
        <form onSubmit={registerUser}>
          <input // input for user name 
            value={name}
            type="text"
            className="name"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />

          <input // input for email
            value={email}
            type="email"
            className="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input // input for password 
            value={password}
            type="password"
            className="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <input className="submit" type="submit" value="SIGN UP"  />
        </form>
        {/* form ends here  */}

      </div>
      {/* registration part ends here  */}


    </>
  );
}

export default App;
