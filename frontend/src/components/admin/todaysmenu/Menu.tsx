import React, { useState } from 'react';
import { FaFastBackward, FaFastForward, FaPencilAlt } from 'react-icons/fa';
import { TodaysMenuInterface } from '../../../modle';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { FaTrashAlt } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../../firebase';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { toast } from 'react-toastify';

interface Props {
  menu: TodaysMenuInterface;
}

const Menu: React.FC<Props> = ({ menu }) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const [image, setImage] = useState<File>();
  const [name, setName] = useState<string>(menu.name);

  const success = (message: string) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  };

  const handleFileChange = (files: any) => {
    if (files && files[0].size < 10000000) {
      setImage(files[0]);
    }
  };

  const addOrRemoveFromMenus = async (value: boolean) => {
    const menuReference = doc(db, 'todaysmenus', menu.id);

    updateDoc(menuReference, {
      today: value,
    });
  };

  const handleDelete = async () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="bg-white shadow-2xl rounded-lg px-8 py-5">
            <div className="font-semibold text-slate-700 text-lg">
              Are you sure?
            </div>
            <p className="text-sm text-slate-600 mb-3">
              You want to delete this menu?
            </p>

            <button
              onClick={async () => {
                const menuReference = doc(db, 'todaysmenus', menu.id);
                const imageReference = ref(
                  storage,
                  `todaysmenus/${menu.imageRef}`
                );

                await deleteObject(imageReference);
                await deleteDoc(menuReference);

                onClose();
              }}
              className="bg-red-700 px-3 py-1 rounded-lg text-sm text-white border hover:bg-white hover:text-red-700 hover:border-red-700 transition mr-3"
            >
              Yes
            </button>
            <button
              className="bg-slate-700 px-3 py-1 rounded-lg text-sm text-white border hover:bg-white hover:text-slate-700 hover:border-slate-700 transition"
              onClick={onClose}
            >
              No
            </button>
          </div>
        );
      },
    });
  };

  const handleUpdate = async () => {
    if (image) {
      const deleteRef = ref(storage, `todaysmenus/${menu.imageRef}`);

      deleteObject(deleteRef).then(() => {
        const time = Date.now();

        const imageReference = ref(storage, 'todaysmenus/' + time);

        uploadBytesResumable(imageReference, image)
          .then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
              const menuReference = doc(db, 'todaysmenus', menu.id);

              updateDoc(menuReference, {
                name: name,
                image: url,
                imageRef: time,
                type: snapshot.metadata.contentType?.split('/')[1],
              })
                .then(() => {
                  success(`${menu.name + ' updated successfully'}`);
                })
                .catch((error) => {
                  error(`Cannot update ${menu.name}. Please try again.`);
                });
            });
          })
          .catch((error) => {
            error(`Cannot update ${menu.name}. Please try again.`);
          });
      });
    } else {
      const menuReference = doc(db, 'todaysmenus', menu.id);

      await updateDoc(menuReference, {
        name: name,
      });

      success(`${menu.name + ' updated successfully'}`);
    }
  };

  return (
    <div>
      <div className="shadow-xl p-5 w-60 rounded-lg m-3 relative">
        <LazyLoadImage
          src={menu.image}
          alt={`${menu.name}_image`}
          className="mb-3 rounded-lg w-[200px] h-[133.2px] object-cover"
          width={200}
          height={133.2}
        />

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-700 font-medium">{menu.name}</div>
          {!menu.today ? (
            <div className="flex items-center space-x-2">
              <FaTrashAlt
                color="#fa2020"
                cursor={'pointer'}
                size={13}
                onClick={() => {
                  handleDelete();
                }}
              />
              <FaPencilAlt
                size={12}
                className="cursor-pointer"
                onClick={() => {
                  setShowModal(true);
                }}
              />
              <FaFastForward
                size={15}
                className="cursor-pointer"
                color="green"
                onClick={() => {
                  addOrRemoveFromMenus(true);
                }}
              />
            </div>
          ) : (
            <div>
              <FaFastBackward
                size={15}
                className="cursor-pointer"
                color="red"
                onClick={() => {
                  addOrRemoveFromMenus(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <>
          <div className="opacity-0.25 fixed inset-0 z-40 bg-dialog-bg"></div>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*  */}
                <div className="bg-white shadow-2xl rounded-lg px-4 py-5 w-[300px]">
                  <div className="font-semibold text-slate-700 text-lg mb-3">
                    {`Edit ${menu.name}`}
                  </div>

                  <div>
                    <img
                      src={menu.image}
                      alt={`${menu.name}-image`}
                      className="w-20 mb-3 rounded-md"
                    />
                    <label className="block mb-4">
                      <span className="block text-sm font-medium text-slate-700 mb-1">
                        Choose menu photo
                      </span>
                      <input
                        required
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-1 file:px-2
        file:rounded-full file:border-0
        file:text-sm file:font-medium
        file:bg-slate-200 file:text-slate-600
        hover:file:bg-slate-300 outline-none"
                        onChange={(file) => handleFileChange(file.target.files)}
                      />
                    </label>
                    <label className="block mb-4">
                      <span className="block text-sm font-medium text-slate-700 mb-0.5">
                        Name
                      </span>
                      <input
                        required
                        type="text"
                        placeholder="Name"
                        className="border border-slate-300 rounded-md outline-none text-sm shadow-sm px-3 py-2 placeholder-slate-400 w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </label>
                  </div>

                  <p className="text-sm text-slate-600 mb-3">
                    You want to update {menu.name} menu?
                  </p>

                  <button
                    onClick={() => {
                      handleUpdate();
                      setShowModal(false);
                    }}
                    className="bg-red-700 px-3 py-1 rounded-lg text-sm text-white border hover:bg-white hover:text-red-700 hover:border-red-700 transition mr-3"
                  >
                    Yes
                  </button>
                  <button
                    className="bg-slate-700 px-3 py-1 rounded-lg text-sm text-white border hover:bg-white hover:text-slate-700 hover:border-slate-700 transition"
                    onClick={() => {
                      setShowModal(false);
                    }}
                  >
                    No
                  </button>
                </div>
                {/*  */}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Menu;
