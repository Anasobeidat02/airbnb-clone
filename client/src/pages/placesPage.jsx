import { React, useState } from "react";
import { Await, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Perks from "../Perks";
import axios from "axios";
export default function placesPage() {
  const { action } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  // const [price, setPrice] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState("");
  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }
  function preInput(Header) {
    return <>{inputHeader(Header)}</>;
  }
  async function addPhotoByLink(ev) {
    ev.preventDefault();
    const { data: filename } = await axios.post("/upload-by-link", {
      link: photoLink,
    });
    setAddedPhotos((prev) => {
      return [...prev, filename];
    });
    setPhotoLink(" ");
  }
  function uploadPhoto(ev) {
    const files = ev.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    axios
      .post("/upload", data, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        const { data: filenames } = res;
        setAddedPhotos((prev) => {
          return [
            ...prev,
            ...filenames.map((name) => name.replace(/^uploads\//, "")),
          ];
        });
      });
  }

  function addNewPlace(ev) {
    ev.preventDefault();
    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkInTime,
      checkOutTime,
      maxGuests,
    };
    axios.post("/places", placeData);
    setRedirect("/account/places");
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      {action !== "new" && (
        <div className=" text-center">
          <Link
            className=" inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full "
            to={"/account/places/new"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add new place
          </Link>
        </div>
      )}
      {action === "new" && (
        <div>
          <form action="" onSubmit={addNewPlace}>
            {preInput("Title")}
            <input
              type="text"
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
            />
            {preInput("Address")}
            <input
              type="text"
              placeholder="address"
              value={address}
              onChange={(ev) => setAddress(ev.target.value)}
            />
            {preInput("Photos")}

            <div className="flex gap-2 ">
              <input
                type="text"
                placeholder="Add using a Link......jpg"
                value={photoLink}
                onChange={(ev) => setPhotoLink(ev.target.value)}
              />
              <button
                onClick={addPhotoByLink}
                className="bg-gray-200 px-4 rounded-2xl"
              >
                Add&nbsp;photo
              </button>
            </div>

            <div className=" mt-2 gap-2 grid grid-cols-3 lg:grid-cols-6 md:grid-cols-4 ">
              {addedPhotos.length > 0 &&
                addedPhotos.map((link) => (
                  <div className="h-32 flex " key={link}>
                    <img
                      className="rounded-2xl w-full object-cover  "
                      src={`http://localhost:4000/uploads/${link}`}
                      alt="Uploaded"
                    />
                  </div>
                ))}

              <label className="h-32 cursor-pointer border bg-transparent rounded-2xl p-8 text-2xl text-gray-600 flex items-center justify-center gap-1">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={uploadPhoto}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                  />
                </svg>
                upload
              </label>
            </div>
            <h2 className="text-2xl mt-4">description</h2>
            <textarea
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
            />

            <h2 className="text-2xl mt-4">Perks</h2>
            <div className="grid mt-2  grid-cols-2 md:grid-cols-3  lg:grid-cols-6 gap-2">
              <Perks selected={perks} onChange={setPerks} />
            </div>
            <h2 className="text-2xl mt-4">Extra info</h2>
            <textarea
              value={extraInfo}
              onChange={(ev) => setExtraInfo(ev.target.value)}
            />
            <h2 className="text-2xl mt-4">Check in&out times , max guests</h2>
            <p className="text-gray-500 text-sm ">
              Add check in and out times ,remember to have some time window for
              cleaning the room between guests
            </p>
            <div className="grid sm:grid-cols-3 gap-2">
              <div>
                <h3 className="mt-2 -mb-1">check in time</h3>
                <input
                  type="text"
                  placeholder="14:00"
                  value={checkInTime}
                  onChange={(ev) => setCheckInTime(ev.target.value)}
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">check out time</h3>
                <input
                  type="text"
                  placeholder="11"
                  value={checkOutTime}
                  onChange={(ev) => setCheckOutTime(ev.target.value)}
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">max number of guests</h3>
                <input
                  type="number"
                  value={maxGuests}
                  onChange={(ev) => setMaxGuests(ev.target.value)}
                />
              </div>
            </div>
            <div className="">
              <button className="primary my-4">save</button>
            </div>
          </form>
        </div>
      )}

      {/* <h1>My Places</h1> */}
    </div>
  );
}
