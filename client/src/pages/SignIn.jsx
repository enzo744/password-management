import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInStart,signInSuccess,signInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";


export default function SignIn() {
  const [formData, setFormData] = useState({});
  const {loading, error:errorMessage} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill out all fields."));
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-serif dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-yellow-300 rounded-lg text-white">
              Password App
            </span>
          </Link>
          <p className="text-sm mt-5">
            Progetto dimostrativo, finalizzato alla gestione di vari campi
            personali.
          </p>
        </div>
        {/* right */}

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="">
              <Label value="La tua Email" />
              <TextInput
                type="text"
                placeholder="Email"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div className="relative text-2xl">
              <Label value="La tua Password***" />
              <TextInput
                className="w-full"
                type={open === false ? "password" : "text"}
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
              <div className="absolute top-10 right-3">
                {open === false ? (
                  <AiFillEye onClick={toggle} className="cursor-pointer" />
                ) : (
                  <AiFillEyeInvisible
                    onClick={toggle}
                    className="cursor-pointer"
                  />
                )}
              </div>
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  {/* <Spinner size="sm" /> */}
                  <Spinner
                    color="success"
                    aria-label="Success spinner example"
                  />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Accedi"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-3">
            <span>Non hai un account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Registrati
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
