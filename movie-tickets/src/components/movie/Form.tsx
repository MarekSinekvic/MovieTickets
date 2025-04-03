import { FunctionComponent, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Movie } from "@/types/Movie";
import TagsSelector from "../filters/TagsSelector";

import "../../app/globals.css";
import { Media } from "@/types/Media";
import Header from "../Header";

interface Props {
  movie?: Movie;
}

interface SaveParams {
  values: Movie;
}

interface DeleteParams {
  id: string;
}

const saveMovie = async ({ values, files }: SaveParams & {files:FileList|null}) => {
  const movieResponse = await fetch<Movie>(!values["@id"] ? "/movies" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });
  const movieID: string|undefined = movieResponse?.data["@id"];
  console.log(movieResponse?.data);
  if (movieID && files) {
    console.log(files);
    for (const file of files) {
      const filesForm = new FormData();
      filesForm.append("movie", movieID);
      filesForm.append("media",(file));
      fetch<Media>('/media', {
        method: "post",
        body: filesForm
      });
    }
  }
  return movieResponse;
}

const deleteMovie = async (id: string) =>
  await fetch<Movie>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ movie }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();
  const [files,setFiles] = useState<FileList | null>(null);

  const saveMutation = useMutation<
    FetchResponse<Movie> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveMovie({...saveParams,files: files}));

  const deleteMutation = useMutation<
    FetchResponse<Movie> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteMovie(id), {
    onSuccess: () => {
      router.push("/movies");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!movie || !movie["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: movie["@id"] });
  };

  return (
    <>
      <Header/>
      <div className="container mx-auto px-4 max-w-2xl mt-4">
        <h1 className="text-3xl my-2">
          {movie ? `Edit Movie ${movie["@id"]}` : `Create Movie`}
        </h1>
        <Formik
          initialValues={
            movie
              ? movie
              : new Movie()
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
                  router.push("/movies");
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
              <div className="flex flex-col py-4 gap-2">
                <div className="flex flex-col items-center gap-2">
                  <label htmlFor="add-media-input">
                    <div style={{border: '1px dashed white', width: "200px", height: '300px'}} className="flex flex-col gap-1 items-center justify-center">
                      Add media
                    </div>
                  </label>
                    <div className="flex flex-row items-center justify-center gap-1">
                      {(files) ? Array.from(files).map((file)=>{
                        return <img src={URL.createObjectURL(file)} style={{height: '100px'}}/>;
                      }) : ''}
                    </div>
                  <input defaultValue={values.files} name="media[]" type="file" id="add-media-input" onChange={(event)=>{setFiles(event.currentTarget.files);}} hidden multiple/>
                  <input name="preview" hidden/>
                  <div className="flex gap-1">
                    <input defaultValue={values.name ?? ""} name="name" placeholder="Movie name" onChange={handleChange}/>
                    <TagsSelector isFilter={false}/> 
                  </div>
                </div>
                <textarea placeholder="Description" defaultValue={values.description ?? ""} style={{resize: 'both'}} rows={6} cols={64} name="description" onChange={handleChange}></textarea>
                <div className="flex justify-end gap-1">
                  <button type="submit">Create</button>
                  <Link href="/" className="button">Back</Link>
                </div>
              </div>
            </form>
          )}
        </Formik>
        <div className="flex space-x-2 mt-4 justify-end">
          {movie && (
            <button
              className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-sm text-red-400 font-bold py-2 px-4 rounded"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </>
  );
};
