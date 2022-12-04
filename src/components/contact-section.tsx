"use client";

import * as React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "./button";
import { FormField } from "./form/form-field";
import { Input } from "./form/input";
import { Textarea } from "./form/textarea";

const initialValues = {
  name: "",
  email: "",
  message: "",
};

const schema = yup.object().shape({
  name: yup.string().min(2).max(255),
  email: yup.string().email().min(2).max(255),
  message: yup.string().min(5),
});

type State = "loading" | "completed" | "error";
export function ContactSection() {
  const [message, setMessage] = React.useState<string | null>(null);
  const [state, setState] = React.useState<State | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: initialValues, resolver: yupResolver(schema) });

  async function onSubmit(data: typeof initialValues) {
    setState("loading");

    const res = await fetch("/api/mail", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    });

    if (res.ok) {
      setState("completed");
      setMessage("Message successfully sent! You should receive a confirmation email.");
      reset();
    } else {
      setState("error");
      if (res.status === 429) {
        setMessage("Woah! You're moving to fast. Please try again in several minutes.");
      } else {
        setMessage("Could not sent the email. Please try again later.");
      }
    }
  }

  return (
    <section className="pb-5 mt-10" id="contact">
      <h1 className="text-3xl font-bold capitalize md:text-4xl">Contact Me</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
        {message ? (
          <p role="alert" className="p-2 px-3 mb-3 rounded-md bg-secondary text-white shadow-sm">
            {message}
          </p>
        ) : null}

        <FormField errorMessage={errors.name} id="name" label="Name">
          <Input
            hasError={!!errors.name}
            {...register("name", { required: true, disabled: state === "loading" })}
          />
        </FormField>

        <FormField errorMessage={errors.email} id="email" label="Email">
          <Input
            hasError={!!errors.email}
            {...register("email", { required: true, disabled: state === "loading" })}
          />
        </FormField>

        <FormField errorMessage={errors.message} className="mb-0" id="message" label="Message">
          <Textarea
            hasError={!!errors.message}
            {...register("message", { required: true, disabled: state === "loading" })}
          />
        </FormField>

        <div className="flex items-start justify-between mt-6">
          <a className="italic underline" href="mailto:hello@caspertheghost.me">
            Send me an email directly
          </a>
          <Button disabled={state === "loading"} type="submit">
            {state === "loading" ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </section>
  );
}