import { CardActions, CardContent } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Container from "@material-ui/core/Container";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import Uploader from "../components/Uploader";
import SchematicType from "../enums/schematic-type";
import EnhancedSchematicViewer from "../components/EnhancedSchematicViewer";
import Button from "@material-ui/core/Button";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import save from "save-file";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";
import DownloadIcon from "@material-ui/icons/GetApp";
import { blobToBase64, blobToJson } from "../utils/blobs";
import { getFileNameWithoutExtension } from "../utils/files";
import { arrayBufferToBase64 } from "../utils/buffers";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
  },
  viewerContainer: {
    display: "flex",
    justifyContent: "center",
  },
  viewerCard: {
    width: 700,
  },
  card: {
    minWidth: "100%",
  },
  cardContent: {
    padding: theme.spacing(2),
    "&:last-child": {
      paddingBottom: theme.spacing(2),
    },
  },
  cardActions: {
    margin: "0 auto",
  },
  progress: {
    marginTop: theme.spacing(2),
  },
}));

const displayFileType = (schematicType: SchematicType) => {
  switch (schematicType) {
    case SchematicType.SPONGE:
      return "Sponge (.schem) file";
    case SchematicType.MCEDIT:
      return "MCEdit (.schematic) file";
    case SchematicType.STRUCTURE:
      return "Minecraft Structure (.nbt) file";
  }
};

const ViewerPage = () => {
  const classes = useStyles();
  const [error, showError] = useState<string | null>(null);
  const [schematic, setSchematic] = useState<{
    type: SchematicType;
    file: File;
  } | null>(null);
  const [schem, setSchem] = useState<{ file: File; base64: string } | null>(
    null
  );

  const handleUpload = async (schematic: {
    type: SchematicType;
    file: File;
  }) => {
    setSchematic(schematic);
    if (schematic.type === SchematicType.SPONGE) {
      const buffer: ArrayBuffer = await schematic.file.arrayBuffer();
      setSchem({ file: schematic.file, base64: arrayBufferToBase64(buffer) });
      return;
    }

    const form = new FormData();
    form.append("file", schematic.file);
    try {
      const res = await axios({
        method: "post",
        url: "https://schematic-converter.mcjeffr.com",
        data: form,
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob",
      });

      const fileName = getFileNameWithoutExtension(schematic.file.name);
      const file = new File([res.data], `${fileName}.schem`, {
        type: res.data.type,
      });
      let base64 = await blobToBase64(res.data);
      base64 = base64.substr(base64.indexOf(",") + 1);

      const schem = {
        file,
        base64,
      };
      setSchem(schem);
    } catch (err) {
      if (err.response.data.type === "application/json") {
        try {
          const json = await blobToJson(err.response.data);
          console.log(json.message);
          showError(json.message);
          setSchematic(null);
          setSchem(null);
        } catch (err) {
          showError(
            err.message
              ? err.message
              : "Could not process file: unknown exception occurred."
          );
          setSchematic(null);
          setSchem(null);
        }
      } else {
        showError(
          err.message
            ? err.message
            : "Could not process file: unknown exception occurred."
        );
        setSchematic(null);
        setSchem(null);
      }
      console.error(err);
    }
  };

  const handleClose = () => {
    setSchematic(null);
    setSchem(null);
  };

  let card;
  if (schematic && schem) {
    card = (
      <Card className={classes.viewerCard}>
        <CardHeader
          title={schematic.file.name}
          subheader={displayFileType(schematic.type)}
          action={
            <IconButton aria-label="delete" onClick={handleClose}>
              <ClearIcon />
            </IconButton>
          }
        />
        <CardContent>
          <div className={classes.viewerContainer}>
            <EnhancedSchematicViewer schematic={schem.base64} />
          </div>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Button
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={async () => {
              const file = getFileNameWithoutExtension(schematic.file.name);
              await save(schem.file, `${file}.schem`);
            }}
          >
            Download as .schem file
          </Button>
        </CardActions>
      </Card>
    );
  } else if (schematic) {
    card = (
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Typography variant="h4">
            Converting {schematic.type} to .schem...
          </Typography>
          <LinearProgress className={classes.progress} />
        </CardContent>
      </Card>
    );
  } else {
    card = (
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Uploader onUpload={handleUpload} />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Container className={classes.container}>{card}</Container>
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

export default ViewerPage;
