"use server";

import { Doctor } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";
import { ID, Permission, Query, Role } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import {
  BUCKET_ID,
  DATABASE_ID,
  DOCTOR_COLLECTION_ID,
  databases,
  ENDPOINT,
  PROJECT_ID,
  storage,
} from "../appwrite.config";
import { parseStringify } from "../utils";

const DEFAULT_DOCTOR_IMAGE = "/assets/icons/user.svg";
const PUBLIC_READ = [Permission.read(Role.any())];

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
      doctors.map(async (doctor) => {
        let imageUrl = DEFAULT_DOCTOR_IMAGE;

        if (doctor.image && BUCKET_ID) {
          const inputFile = InputFile.fromBuffer(
            doctor.image.get("blobFile") as Blob,
            doctor.image.get("fileName") as string
          );

          const file = await storage.createFile(
            BUCKET_ID,
            ID.unique(),
            inputFile,
            PUBLIC_READ
          );

          imageUrl = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`;
        }

        return databases.createDocument(
          databaseId,
          collectionId,
          ID.unique(),
          {
            name: doctor.name.trim(),
            image: imageUrl,
          },
          PUBLIC_READ
        );
      })
    );

    revalidatePath("/admin");
    revalidatePath("/patients", "layout");

    return parseStringify(created);
  } catch (error: any) {
    console.log(error);
    const message =
      error?.type === "document_invalid_structure"
        ? 'Doctor collection is missing attributes. In Appwrite, add string attributes "name" and "image" to the doctors collection.'
        : error?.message || "Failed to create doctors";
    throw new Error(message);
  }
};

export const deleteDoctor = async (doctorId: string) => {
  if (!DATABASE_ID || !DOCTOR_COLLECTION_ID || !doctorId) {
    return null;
  }

  try {
    const doctor = await databases.getDocument(
      DATABASE_ID,
      DOCTOR_COLLECTION_ID,
      doctorId
    );

    await databases.deleteDocument(
      DATABASE_ID,
      DOCTOR_COLLECTION_ID,
      doctorId
    );

    if (BUCKET_ID && typeof doctor.image === "string") {
      const match = doctor.image.match(/\/files\/([^/]+)\/view/);
      const fileId = match?.[1];
      if (fileId) {
        try {
          await storage.deleteFile(BUCKET_ID, fileId);
        } catch (fileError) {
          console.log(fileError);
        }
      }
    }

    revalidatePath("/admin");
    revalidatePath("/patients", "layout");

    return parseStringify({ success: true, doctorId });
  } catch (error) {
    console.log(error);
  }
};
