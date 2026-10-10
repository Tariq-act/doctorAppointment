"use server";

import { ID, Query } from "node-appwrite";
import {
  DATABASE_ID,
  DOCTOR_COLLECTION_ID,
  databases,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { Doctor } from "@/types/appwrite.types";

const DEFAULT_DOCTOR_IMAGE = "/assets/icons/user.svg";

export const getDoctors = async (): Promise<Doctor[]> => {
  if (!DATABASE_ID || !DOCTOR_COLLECTION_ID) {
    return [];
  }

  try {
    const { documents } = await databases.listDocuments(
      DATABASE_ID,
      DOCTOR_COLLECTION_ID,
      [Query.orderDesc("$createdAt"), Query.limit(100)]
    );

    return parseStringify(documents);
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createDoctors = async (doctors: CreateDoctorParams[]) => {
  if (!DATABASE_ID || !DOCTOR_COLLECTION_ID) {
    console.log("Doctor collection is not configured");
    return null;
  }

  const databaseId = DATABASE_ID;
  const collectionId = DOCTOR_COLLECTION_ID;

  try {
    const created = await Promise.all(
      doctors.map((doctor) =>
        databases.createDocument(databaseId, collectionId, ID.unique(), {
          name: doctor.name.trim(),
          image: doctor.image?.trim() || DEFAULT_DOCTOR_IMAGE,
        })
      )
    );

    revalidatePath("/admin");
    revalidatePath("/patients", "layout");

    return parseStringify(created);
  } catch (error) {
    console.log(error);
  }
};
