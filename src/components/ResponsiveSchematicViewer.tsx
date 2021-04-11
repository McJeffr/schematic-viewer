import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SchematicViewer from "@mcjeffr/react-schematicwebviewer";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { FC, useEffect, useState } from "react";
import Alert from "@material-ui/lab/Alert";

export interface ResponsiveSchematicViewerProps {
  schematic: string;
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
}));

const ResponsiveSchematicViewer: FC<ResponsiveSchematicViewerProps> = ({
  schematic,
}) => {
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
            Timeout occurred whilst loading the preview. There is a high chance
            that your file is either too old to process or has been corrupted.
            Downloading the .schem file might result in a broken schematic being
            returned.
          </Alert>
        </div>
      ) : (
        <SchematicViewer
          jarUrl="https://cors-proxy.mcjeffr.com/https://launcher.mojang.com/v1/objects/37fd3c903861eeff3bc24b71eed48f828b5269c8/client.jar"
          schematic={schematic}
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
      )}
    </>
  );
};

export default ResponsiveSchematicViewer;
