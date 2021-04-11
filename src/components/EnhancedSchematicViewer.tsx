import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SchematicViewer from "@mcjeffr/react-schematicwebviewer";
import CircularProgress from "@material-ui/core/CircularProgress";
import ImageSearchIcon from "@material-ui/icons/ImageSearch";
import React, { FC, useEffect, useState } from "react";
import Alert from "@material-ui/lab/Alert";
import { IconButton } from "@material-ui/core";
import Button from "@material-ui/core/Button";

export interface EnhancedSchematicViewerProps {
  schematic: string;
}

interface ViewerProps {
  schematic: string;
  onClose: () => void;
}

const useStyles = makeStyles((theme) => ({
  spinnerContainer: { display: "flex", width: "100%", height: "100%" },
  spinner: {
    width: "100%",
    textAlign: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  spinnerText: {
    marginTop: theme.spacing(2),
  },
  controls: {
    display: "flex",
    justifyContent: "center",
  },
}));

const EnhancedSchematicViewer: FC<EnhancedSchematicViewerProps> = ({
  schematic,
}) => {
  const [previewed, showPreview] = useState<boolean>(false);

  if (!previewed) {
    return (
      <div>
        <IconButton onClick={() => showPreview(true)}>
          <ImageSearchIcon fontSize="large" />
        </IconButton>
      </div>
    );
  }

  return (
    <div>
      <Viewer schematic={schematic} onClose={() => showPreview(false)} />
    </div>
  );
};

const Viewer: FC<ViewerProps> = ({ schematic, onClose }) => {
  const classes = useStyles();

  const [timedOut, setTimedOut] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimedOut(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {timedOut && !loaded ? (
        <div>
          <Alert severity="error">
            Timeout occurred whilst loading the preview. You can still download
            the .schem file but its integrity cannot be verified. Possible
            reasons for the timeout:
            <ul>
              <li>
                Your schematic contains blocks not yet supported by the
                previewer
              </li>
              <li>The schematic conversion failed</li>
              <li>Your schematic is corrupt</li>
            </ul>
          </Alert>
        </div>
      ) : (
        <div>
          <SchematicViewer
            jarUrl="https://cors-proxy.mcjeffr.com/https://launcher.mojang.com/v1/objects/37fd3c903861eeff3bc24b71eed48f828b5269c8/client.jar"
            schematic={schematic}
            orbit={false}
            size={600}
            loader={
              <div className={classes.spinnerContainer}>
                <div className={classes.spinner}>
                  <CircularProgress size={100} />
                  <Typography variant="body1" className={classes.spinnerText}>
                    Loading schematic...
                  </Typography>
                </div>
              </div>
            }
            onLoaded={() => setLoaded(true)}
          />
          <div className={classes.controls}>
            <Button onClick={onClose}>Close preview</Button>
          </div>
        </div>
      )}
    </>
  );
};

export default EnhancedSchematicViewer;
