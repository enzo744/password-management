import { Button, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { useState } from "react";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);

  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-serif text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <img
            src={currentUser.profilePicture}
            alt="user"
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
        />
        <div className="relative text-2xl">
          <TextInput
            className="w-full font-serif"
            type={open === false ? "password" : "text"}
            placeholder="Password"
            id="password"
            // onChange={handleChange}
          />
          <div className="absolute top-2 right-3">
            {open === false ? (
              <AiFillEye onClick={toggle} className="cursor-pointer" />
            ) : (
              <AiFillEyeInvisible onClick={toggle} className="cursor-pointer" />
            )}
          </div>
        </div>

        <Button
          className="font-serif"
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
        >
          Aggiorna profilo
        </Button>
        <div className="text-red-500 flex justify-between mt-4">
          <span className="cursor-pointer">Elimina Account</span>
          <span className="cursor-pointer">Esci</span>
        </div>
      </form>
    </div>
  );
}
