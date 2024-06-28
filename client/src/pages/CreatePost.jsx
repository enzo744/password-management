import { Button, FileInput, Select, TextInput, Textarea } from "flowbite-react";
import { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

export default function CreatePost() {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-serif">Crea nuova voce</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Nuova voce (campo obblig. ed univoco)*"
            required
            id="title"
            className="flex-1 "
          />
          <Select>
            <option value="tutte">Tutte le categorie</option>
            <option value="personali">Personali</option>
            <option value="ufficio">Ufficio</option>
            <option value="sitiweb">Siti Web</option>
            <option value="social">Social Network</option>
            <option value="emailaddress">Email</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput typeof="file" accept="image/*" />
          <Button
            type="button"
            gradientDuoTone="pinkToOrange"
            size="sm"
            outline
          >
            Scarica immagine
          </Button>
        </div>
        <div className="flex flex-col gap-5 border-4 border-green-500 border-dotted p-3">
          <Textarea
            className="font-serif"
            rows={4}
            placeholder="Inserire qualcosa per ricordare...."
            id="testolibero"
          />
            <TextInput
              className="font-serif"
              type="email"
              placeholder="Inserire solo formato email (xxxx@dominio.com)"
              id="email"
            />
            <div className="relative text-2xl">
              <TextInput
                className="font-serif max-w-full"
                type={open === false ? "password" : "text"}
                placeholder="Password"
                id="password"
              />
              <div className="absolute top-2 right-3">
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
          </div>
        <Button type="button" gradientDuoTone="cyanToBlue" outline>
          Salva dati
        </Button>
      </form>
    </div>
  );
}
