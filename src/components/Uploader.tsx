import Snackbar from "@material-ui/core/Snackbar";
import { DropzoneArea } from "material-ui-dropzone";
import Alert from "@material-ui/lab/Alert";
import React, { FC, useState } from "react";
import SchematicType from "../enums/schematic-type";

export interface UploaderProps {
  onUpload: (schematic: { type: SchematicType; file: File }) => void;
}

const Uploader: FC<UploaderProps> = ({ onUpload }) => {
  const [error, showError] = useState<string | null>(null);

  const handleUpload = (files: File[]) => {
    if (files.length === 0) {
      return;
    }

    const file = files[0];
    const extension = file.name.split(".").pop();
    let schematicType;
    switch (extension) {
      case "schem":
        schematicType = SchematicType.SPONGE;
        break;
      case "schematic":
        schematicType = SchematicType.MCEDIT;
        break;
      case "nbt":
        schematicType = SchematicType.STRUCTURE;
        break;
      default:
        schematicType = null;
    }
    if (!schematicType) {
      showError(
        "Unsupported file uploaded. Only .schem, .schematic and .nbt files are supported."
      );
      return;
    }

    onUpload({ type: schematicType, file });
  };

  return (
    <>
      <DropzoneArea
        filesLimit={1}
        showPreviewsInDropzone={false}
        dropzoneText={"Drag and drop a .schem, .schematic or .nbt file here"}
        showAlerts={false}
        onChange={handleUpload}
      />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={!!error}
        autoHideDuration={4000}
        onClose={() => showError(null)}
      >
        <Alert severity="error" elevation={6} variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Uploader;
