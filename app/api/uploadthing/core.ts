import getUser from "@/app/actions/getUser";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { UTApi } from "uploadthing/server";
export const utapi = new UTApi();
 
const f = createUploadthing();
 
export const ourFileRouter = {
  imageAcc: f({ image: { maxFileSize: "4MB" , maxFileCount:1 } })
  .middleware(async () => {
    const user = await getUser();
    if (!user) throw new UploadThingError("Unauthorized");
    return { userId: user.id };
  })
  .onUploadComplete((data) => console.log("file", data)),
  imageUnit: f({ image: { maxFileSize: "4MB" , maxFileCount:4 } })
    .middleware(async () => {
      const user = await getUser();
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })

    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
      
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;