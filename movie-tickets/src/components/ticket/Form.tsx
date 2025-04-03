import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Ticket } from "../../../src/types/Ticket";

import "@/app/globals.css";

interface Props {
  ticket?: Ticket;
}

interface SaveParams {
  values: Ticket;
}

interface DeleteParams {
  id: string;
}

const saveTicket = async ({ values }: SaveParams) =>
  await fetch<Ticket>(!values["@id"] ? "/tickets" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteTicket = async (id: string) =>
  await fetch<Ticket>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ ticket }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Ticket> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveTicket(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Ticket> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteTicket(id), {
    onSuccess: () => {
      router.push("/tickets");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!ticket || !ticket["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: ticket["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/tickets"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {ticket ? `Edit Ticket ${ticket["@id"]}` : `Create Ticket`}
      </h1>
      <Formik
        initialValues={
          ticket
            ? {
                ...ticket,
              }
            : new Ticket()
        }
        validate={() => {
          const errors = {};
          // add your validation logic here
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setStatus, setErrors }) => {
          const isCreation = !values["@id"];
          saveMutation.mutate(
            { values },
            {
              onSuccess: () => {
                setStatus({
                  isValid: true,
                  msg: `Element ${isCreation ? "created" : "updated"}.`,
                });
                router.push("/tickets");
              },
              onError: (error) => {
                setStatus({
                  isValid: false,
                  msg: `${error.message}`,
                });
                if ("fields" in error) {
                  setErrors(error.fields);
                }
              },
              onSettled: () => {
                setSubmitting(false);
              },
            }
          );
        }}
      >
        {({
          values,
          status,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form className="shadow-md p-4" onSubmit={handleSubmit}>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="ticket_show"
              >
                show
              </label>
              <input
                name="show"
                id="ticket_show"
                value={values.show ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.show && touched.show ? "border-red-500" : ""
                }`}
                aria-invalid={errors.show && touched.show ? "true" : undefined}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="show"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="ticket_client"
              >
                client
              </label>
              <input
                name="client"
                id="ticket_client"
                value={values.client ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.client && touched.client ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.client && touched.client ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="client"
              />
            </div>
            {status && status.msg && (
              <div
                className={`border px-4 py-3 my-4 rounded ${
                  status.isValid
                    ? "text-cyan-700 border-cyan-500 bg-cyan-200/50"
                    : "text-red-700 border-red-400 bg-red-100"
                }`}
                role="alert"
              >
                {status.msg}
              </div>
            )}
            <button
              type="submit"
              className="inline-block mt-2 bg-cyan-500 hover:bg-cyan-700 text-sm text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </form>
        )}
      </Formik>
      <div className="flex space-x-2 mt-4 justify-end">
        {ticket && (
          <button
            className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-sm text-red-400 font-bold py-2 px-4 rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
