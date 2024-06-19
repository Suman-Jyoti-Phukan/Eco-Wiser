import { useState } from "react";

import { supabase } from "./supabase";

function generateUniqueIdentifier() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

// Donot use effects here. Reduces predictibility.

// All the main CRUD ops function returns promise.

export const useUploadImage = () => {
  const [data, setData] = useState([]);

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const uploadImage = async (file) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      return setError("Only PNG and JPEG/JPG images are allowed.");
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return setError("Image Cannot Exceed 5 mb");
    }

    // Generate a unique identifier for file name
    const uniqueIdentifier = generateUniqueIdentifier();

    // Can choose the original file name but to avoid naming conflicts and be on safe side , generating unique identifiers.
    // Keep the original file extension
    const filePath = `${uniqueIdentifier}.${file.name.split(".").pop()}`;

    try {
      setError("");
      setIsLoading(true);

      const { data, error } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (error) {
        throw new Error(error.message || "Error Uploading Image");
      }

      setData(data);
      // Need direct access to the newly created images.
      return data;
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, uploadImage };
};

export const useGetImage = () => {
  const initialState = {
    data: null,
    error: null,
    isLoading: false,
  };

  const [imageState, setImageState] = useState(initialState);

  const fetchImage = async (imagePath) => {
    try {
      setImageState({ ...initialState, isLoading: true });

      const { data: imageData, error: imageError } = await supabase.storage
        .from("images")
        .getPublicUrl(imagePath);

      if (imageError) {
        throw imageError;
      } else {
        setImageState({ ...initialState, data: imageData });
      }
    } catch (error) {
      setImageState({ ...initialState, error });
    } finally {
      setImageState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }
  };

  return { fetchImage, ...imageState };
};

export const useCreateData = (tableName) => {
  const [data, setData] = useState(null);

  const [error, setError] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const createData = async (newData) => {
    setError(null);

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from(tableName)
        .insert(newData)
        .single()
        .select();

      if (error) {
        throw error;
      }

      setData(data);

      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, createData };
};

export const useFetchData = (tableName) => {
  const [error, setError] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    // Ensure error state is set to default.
    setError("");

    setIsLoading(true);

    try {
      const { data, error } = await supabase.from(tableName).select("*");

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, fetchData };
};

export const useUpdateData = (tableName) => {
  const [error, setError] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState("");

  const updateData = async (id, updates) => {
    setError("");

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq("id", id)
        .select();

      if (error) {
        throw error;
      }

      setData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, data, updateData };
};

export const useDeleteData = (tableName) => {
  const [error, setError] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState("");

  const deleteData = async (id) => {
    setError(null);
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from(tableName)
        .delete()
        .eq("id", id)
        .select();

      if (error) {
        setError(error);
      }

      setData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, deleteData, data };
};
