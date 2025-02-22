import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Show } from "../../types/Show";

interface Props {
  show?: Show;
}

interface SaveParams {
  values: Show;
}

interface DeleteParams {
  id: string;
}

const saveShow = async ({ values }: SaveParams) =>
  await fetch<Show>(!values["@id"] ? "/shows" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteShow = async (id: string) =>
  await fetch<Show>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ show }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Show> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveShow(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Show> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteShow(id), {
    onSuccess: () => {
      router.push("/shows");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!show || !show["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: show["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/shows"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {show ? `Edit Show ${show["@id"]}` : `Create Show`}
      </h1>
      <Formik
        initialValues={
          show
            ? {
                ...show,
                movie: show["movie"]?.["@id"] ?? "",
              }
            : new Show()
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
                router.push("/shows");
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
                htmlFor="show_movie"
              >
                movie
              </label>
              <input
                name="movie"
                id="show_movie"
                value={values.movie ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.movie && touched.movie ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.movie && touched.movie ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="movie"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="show_theater"
              >
                theater
              </label>
              <input
                name="theater"
                id="show_theater"
                value={values.theater ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.theater && touched.theater ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.theater && touched.theater ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="theater"
              />
            </div>
            <div className="mb-2">
              <div className="text-gray-700 block text-sm font-bold">
                tickets
              </div>
              <FieldArray
                name="tickets"
                render={(arrayHelpers) => (
                  <div className="mb-2" id="show_tickets">
                    {values.tickets && values.tickets.length > 0 ? (
                      values.tickets.map((item: any, index: number) => (
                        <div key={index}>
                          <Field name={`tickets.${index}`} />
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => arrayHelpers.insert(index, "")}
                          >
                            +
                          </button>
                        </div>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => arrayHelpers.push("")}
                      >
                        Add
                      </button>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="show_begin_date"
              >
                begin_date
              </label>
              <input
                name="begin_date"
                id="show_begin_date"
                value={values.begin_date?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.begin_date && touched.begin_date
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.begin_date && touched.begin_date ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="begin_date"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="show_end_date"
              >
                end_date
              </label>
              <input
                name="end_date"
                id="show_end_date"
                value={values.end_date?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.end_date && touched.end_date ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.end_date && touched.end_date ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="end_date"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="show_views"
              >
                views
              </label>
              <input
                name="views"
                id="show_views"
                value={values.views ?? ""}
                type="number"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.views && touched.views ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.views && touched.views ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="views"
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
        {show && (
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
