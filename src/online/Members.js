import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

export default function Members({members}) {
  const classes = useStyles();
  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  return (
    <div className={classes.root}>
        {
            members?.map((member, index)=>
                                <Chip key={index}
                                    icon={<FaceIcon />}
                                    label={member.name}
                                    variant="outlined"
                                />
                        )
        }
    </div>
  );
}