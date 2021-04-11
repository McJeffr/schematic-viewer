import { CardActions, CardContent } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Container from "@material-ui/core/Container";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import struct2schem from "struct2schem";
import schematic2schem from "schematic2schem";
import arrayBufferToBuffer from "arraybuffer-to-buffer";
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
  const [schem, setSchem] = useState<{ buffer: Buffer; base64: string } | null>(
    null
  );

  const handleUpload = async (schematic: {
    type: SchematicType;
    file: File;
  }) => {
    setSchematic(schematic);

    let fileBuffer = arrayBufferToBuffer(await schematic.file.arrayBuffer());

    let schemBuffer: Buffer;
    try {
      switch (schematic.type) {
        case SchematicType.SPONGE: {
          schemBuffer = fileBuffer;
          break;
        }
        case SchematicType.MCEDIT: {
          schemBuffer = await schematic2schem(fileBuffer);
          break;
        }
        case SchematicType.STRUCTURE: {
          schemBuffer = await struct2schem(fileBuffer);
        }
      }
    } catch (err) {
      console.error(err);
      showError(
        err.message
          ? err.message
          : "Could not process file: unknown exception occurred."
      );
      setSchematic(null);
      setSchem(null);
      return;
    }

    const schem = {
      buffer: schemBuffer,
      base64: schemBuffer.toString("base64"),
    };
    setSchem(schem);
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
            onClick={async () => {
              const file = schematic.file.name
                .split(".")
                .slice(0, -1)
                .join(".");

              await save(schem.buffer, `${file}.schem`);
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
