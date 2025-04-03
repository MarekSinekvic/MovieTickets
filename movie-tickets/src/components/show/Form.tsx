import { Dispatch, FunctionComponent, SetStateAction, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import { useMutation, useQuery } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Show } from "../../types/Show";
import { Movie } from "@/types/Movie";

import "../../app/globals.css";
import SelectButton from "../common/SelectButton";
import { PageList } from "../movie/PageList";

import {Form as MovieForm} from "../movie/Form";

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

function MovieListModal({movieListSetter, selectMovie, values} : {movieListSetter:Dispatch<SetStateAction<boolean>>, selectMovie:Dispatch<SetStateAction<Movie>>, values: Show}) {
  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full p-8" style={{
        backdropFilter: 'blur(4px)'
      }}>
        <div style={{backgroundColor: "rgba(255,255,255,0.1)", borderRadius: '8px', padding: '16px'}}>
          <div>
            <PageList onClick={(v,i)=>{if (v) {selectMovie(v); values['movie'] = v["@id"]}; movieListSetter(false)}}/>
          </div>
          <div className="flex justify-end">
            <button onClick={()=>movieListSetter(false)} style={{backgroundColor: 'rgba(255,0,0,0.1)'}}>Hide</button>
          </div>
        </div>
      </div>
    </>
  );
}

export const Form: FunctionComponent<Props> = ({ show }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();
  const [movieListShown, setMovieList] = useState(false);
  const [selectedMovie,setSelectedMovie] = useState<Movie>(show?.movie ?? {});

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
          show ? {...show} : new Show()
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
          <form className="shadow-md p-4 flex flex-col gap-4" onSubmit={handleSubmit}>
            {movieListShown ? (<>
              <MovieListModal movieListSetter={setMovieList} selectMovie={setSelectedMovie} values={values}/>
            </>) : ''}
            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-2 items-center">
                <div>
                  <div>{selectedMovie.preview}</div>
                  <div>{selectedMovie.name} : {selectedMovie["@id"]}</div>
                </div>
                <div className="flex gap-1">
                  <SelectButton onClick={()=>{setMovieList(!movieListShown)}}>Select movie</SelectButton>
                  <SelectButton onClick={()=>{router.push('/movies/create')}}>Create new movie</SelectButton>
                </div>
              </div>
              {/* <input
                name="theater"
                id="show_theater"
                value={values.theater ?? ""}
                type="text"
                placeholder="Theater selector"
                className={`mt-1 block w-full ${
                  errors.theater && touched.theater ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.theater && touched.theater ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              /> */}
              <div className="flex items-center gap-1">
                <div>
                  <select name="theater">
                    <option value="Theater 1">Theater 1</option>
                    <option value="Theater 2">Theater 2</option>
                    <option value="Theater 3">Theater 3</option>
                  </select>
                  <ErrorMessage
                    className="text-xs text-red-500 pt-1"
                    component="div"
                    name="theater"
                  />
                </div>
                <div>
                  <div className="flex">
                    <input type="datetime-local" defaultValue={`${new Date(values?.begin_date).toLocaleDateString()}T${new Date(values?.begin_date).toLocaleTimeString()}`} name="begin_date" onChange={handleChange}/> <span>Begin date</span>
                    </div>
                  <div className="flex"><input
                    name="end_date"
                    id="show_begin_date"
                    defaultValue={`${new Date(values?.end_date).toLocaleDateString()}T${new Date(values?.end_date).toLocaleTimeString()}` ?? ""}
                    type="datetime-local"
                    placeholder="Show end date"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  /><span>End date</span></div>
                  <ErrorMessage
                    className="text-xs text-red-500 pt-1"
                    component="div"
                    name="begin_date"
                  />
                </div>
              </div>
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
            <div className="flex w-full justify-end gap-1">
              <button
                type="submit"
                style={{backgroundColor: 'rgba(0,255,255,0.1)'}}
                disabled={isSubmitting}
              >
                Submit
              </button>
              <Link href="/" className="button">Back</Link>
            </div>
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
