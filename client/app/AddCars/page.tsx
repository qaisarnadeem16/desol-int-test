/* eslint-disable @next/next/no-img-element */
'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { storage } from '../../lib/firebaseConfig';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { FaTrash } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import img from '../../public/1.jpg';

interface FormData {
  carModel: string;
  price: number;
  phoneNumber: string;
  maxPictures: number;
  pictures: (File | null)[];
}

const CarForm = () => {
  const initialFormData: FormData = {
    carModel: '',
    price: 0,
    phoneNumber: '',
    maxPictures: 0,
    pictures: [],
  };
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [uploadedPictures, setUploadedPictures] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserId(localStorage.getItem('id'));
    }
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'maxPictures') {
      const maxPics = parseInt(value, 10);
      setFormData({
        ...formData,
        [name]: maxPics,
        pictures: Array(maxPics).fill(null),
      });
    } else if (name.startsWith('picture')) {
      const index = parseInt(name.split('-')[1], 10);
      const updatedPictures = [...formData.pictures];
      const picture = (e.target as HTMLInputElement).files?.[0] || null;
      updatedPictures[index] = picture;
      setFormData({
        ...formData,
        pictures: updatedPictures,
      });

      // Upload the picture immediately after selecting
      if (picture) {
        try {
          const storageRef = ref(storage, `pictures/${picture.name}`);
          await uploadBytes(storageRef, picture);
          const downloadURL = await getDownloadURL(storageRef);
          setUploadedPictures(prevState => [...prevState, downloadURL]); // Update uploaded pictures state
        } catch (error) {
          console.error('Error uploading picture:', error);
          // Handle error as needed
        }
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleDeletePicture = async (url: string) => {
    const pictureRef = ref(storage, url);
    await deleteObject(pictureRef);
    setUploadedPictures(uploadedPictures.filter((pic) => pic !== url));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData();
    form.append('carModel', formData.carModel);
    form.append('price', formData.price.toString());
    form.append('phoneNumber', formData.phoneNumber);
    form.append('maxPictures', formData.maxPictures.toString());

    formData.pictures.forEach((file, index) => {
      if (file) {
        form.append(`picture${index + 1}`, file);
      }
    });

    try {
      await axios.post('https://desol-int-test-server.vercel.app/api/addCar', {
        userId: userId,
        formData: formData,
        pictures: uploadedPictures
      });
      setFormData(initialFormData);
      setUploadedPictures([]);
      toast.success("Car Data Saved Successfully")
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Error Uploading Data")
    }
  };

  return (
    <div className="flex flex-wrap justify-between lg:min-h-screen w-full">
      <section className="relative lg:w-1/2 min-h-screen w-full lg:flex hidden h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full">
        <Image
          alt=""
          src={img}
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
      </section>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 lg:w-1/2 w-full md:flex block items-center justify-center text-black">
        <Toaster />
        <form onSubmit={handleSubmit} className="max-w-lg w-full mx-auto p-6 bg-white shadow-md rounded-md">
          <div className="mb-4">
            <label htmlFor="carModel" className="block text-sm font-medium text-gray-700">
              Car Model
            </label>
            <input
              type="text"
              name="carModel"
              id="carModel"
              minLength={3}
              required
              value={formData.carModel}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              id="price"
              required
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              minLength={11}
              maxLength={11}
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="maxPictures" className="block text-sm font-medium text-gray-700">
              Max Number of Pictures
            </label>
            <select
              name="maxPictures"
              id="maxPictures"
              required
              value={formData.maxPictures}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
            >
              {Array.from({ length: 10 }, (_, i) => i).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          {formData.pictures.map((_, index) => (
            <div className="mb-4" key={index}>
              <label htmlFor={`picture-${index}`} className="block text-sm font-medium text-gray-700">
                Upload Picture {index + 1}
              </label>
              <input
                type="file"
                name={`picture-${index}`}
                id={`picture-${index}`}
                accept="image/*"
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}
          <div className="max-w-lg w-full mx-auto p-3 bg-white shadow-md rounded-md mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedPictures.map((url, index) => (
                <div key={index} className="relative group">
                  <img src={url} alt={`Uploaded Picture ${index + 1}`} className="w-full h-20 object-contain rounded-md" />
                  <button
                    onClick={() => handleDeletePicture(url)}
                    type="button"
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTrash className="text-2xl" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:ring-blue-500">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarForm;
