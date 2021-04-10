import { CardContent } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import Uploader from "../components/Uploader";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
  card: {
    padding: theme.spacing(2),
    "&:last-child": {
      paddingBottom: theme.spacing(2),
    },
  },
}));

const ViewerPage = () => {
  const classes = useStyles();

  return (
    <>
      <Container className={classes.container}>
        <Card>
          <CardContent className={classes.card}>
            <Uploader onUpload={(schematic) => console.log(schematic)} />
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default ViewerPage;
