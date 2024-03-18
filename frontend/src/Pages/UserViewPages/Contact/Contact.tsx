// @ts-nocheck

import { useRef, useState } from "react";
import "./Contact.scss";
import emailjs from "@emailjs/browser";
import {
  notifyFailure,
  notifySuccess,
} from "../../../components/atoms/Toast/Toast";
import Input from "../../../components/atoms/Input";
import Textarea from "../../../components/admin/atoms/Textarea";
import Button from "../../../components/atoms/Button";

const Contact = () => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");

  const [mail, setMail] = useState("");
  const [message, setMessage] = useState("");
  const form = useRef();

  async function sendEmail(e) {
    e.preventDefault();

    if (mail === "" || message === "") {
      notifyFailure("Molimo unesite svoj email i poruku");
      return;
    }

    try {
      await emailjs.sendForm(
        "service_kgsdzxh",
        "template_ewu29ar",

        form.current,
        "Y7mSUnArGFqcm2F-o"
      );

      notifySuccess("Uspješno poslano!!");
      setFirstName("");
      setLastName("");
      setMail("");
      setMessage("");
    } catch (err) {
      notifyFailure("Ups... Nešto je pošlo po zlu.");
    }
  }
  return (
    <div className="contact-parent-wrapper">
      <div className="contact-wrapper" id="contact">
        <div className="contact-form-text-wrapper">
          <h4>KONTAKT</h4>
          <p>
            Ako želite surađivati s nama, slobodno nam se obratite putem ove
            forme. Radujemo se Vašoj poruci i budućoj suradnji.
          </p>
        </div>

        <div className="contact-content-wrapper">
          <form action="" id="contact-form" ref={form}>
            <div className="contact-name-email-wrapper">
              <Input
                label={"Ime"}
                name="first_name"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                label={"Prezime"}
                name="last_name"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
              />

              <Input
                label={"Email"}
                name="user_email"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
              />
            </div>

            <div className="textarea-wrapper">
              <Textarea
                label="Tekst poruke"
                name="message"
                id="message"
                cols="30"
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></Textarea>
            </div>

            <div className="contact-button-wrapper">
              <Button primary onClick={sendEmail}>
                Kontaktirajte nas
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
