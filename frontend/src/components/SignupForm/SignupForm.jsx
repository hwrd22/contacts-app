import './SignupForm.css';

const SignupForm = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  const verifyPassword = password => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  }

  const verifyUsername = username => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
  }

  const onSubmit = evt => {
    evt.preventDefault();
  }

  return ( 
    <div className='signup-form'>
      <h1>Sign Up</h1>
      <form onSubmit={onSubmit}>
        <div className="form-row">
          <label>Email</label>
          <input className="user-form" type="text" id="email"/>
          <div className='input-error'><img src="./src/assets/error.svg" />AAAAA</div>
        </div>
        <div className="form-row">
          <label>Username</label>
          <input className="user-form" type="text" id="username"/>
          <div className='input-error'><img src="./src/assets/error.svg" />AAAAA</div>
        </div>
        <div className="form-row">
          <label>Password</label>
          <input className="user-form" type="password" id="password"/>
          <div className='input-error'><img src="./src/assets/error.svg" />AAAAA</div>
        </div>
        <div className="form-row">
          <label>Confirm Password</label>
          <input className="user-form" type="password"/>
          <div className='input-error'><img src="./src/assets/error.svg" />AAAAA</div>
        </div>
        <button>Sign Up</button>
      </form>
    </div>
   );
}
 
export default SignupForm;