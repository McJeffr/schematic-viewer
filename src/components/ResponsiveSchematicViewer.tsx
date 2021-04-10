import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SchematicViewer from "@mcjeffr/react-schematicwebviewer";
import CircularProgress from "@material-ui/core/CircularProgress";
import { FC } from "react";

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

  return (
    <>
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
      />
    </>
  );
};

export default ResponsiveSchematicViewer;
