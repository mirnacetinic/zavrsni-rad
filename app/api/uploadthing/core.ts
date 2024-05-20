import getUser from "@/app/actions/getUser";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
 
const f = createUploadthing();
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  imageAcc: f({ image: { maxFileSize: "4MB" , maxFileCount:1 } })
  .middleware(async () => {
    const user = await getUser();
    if (!user) throw new UploadThingError("Unauthorized");
    return { userId: user.id };
  })
  .onUploadComplete((data) => console.log("file", data)),
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUnit: f({ image: { maxFileSize: "4MB" , maxFileCount:4 } })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      const user = await getUser();
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
 
      console.log("file url", file.url);
 
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
      
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;