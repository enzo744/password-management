import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { useState } from "react";

export default function SignUp() {

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
            Progetto dimostrativo, finalizzato alla gestione di vari campi personali.
          </p>
        </div>
        {/* right */}

        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div className="">
              <Label value="Il tuo Username" />
              <TextInput type="text" placeholder="Username" id="username" />
            </div>
            <div className="">
              <Label value="La tua Email" />
              <TextInput type="text" placeholder="Email" id="email" />
            </div>
            <div className="relative text-2xl">
            <Label value="La tua Password***" />
              <TextInput
                className="w-full"
                type={open === false ? "password" : "text"}
                placeholder="Password"
                id="password"
                // onChange={handleChange}
              />
              <div className="absolute top-10 right-3">
                {open === false ? (
                  <AiFillEye onClick={toggle} className="cursor-pointer"/>
                ) : (
                  <AiFillEyeInvisible onClick={toggle} className="cursor-pointer"/>
                )}
              </div>
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit">
              Registrati
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-3">
            <span>Hai un account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Accedi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
