import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import bigBrainTheme from '../../../theme/bigBrainTheme';

// Header for leaderboard and statistics sections
const SectionHeader = ({ title, icon }) => (
  <Box
    sx={{
      p: 3,
      textAlign: 'center',
      backgroundColor: bigBrainTheme.palette.primary.main,
      position: 'relative',
    }}
  >
    {icon}
    <Typography
      variant="h4"
      fontWeight={700}
      sx={{
        color: 'white',
        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }}
    >
      {title}
    </Typography>
    {icon &&
      React.cloneElement(icon, {
        sx: {
          ...icon.props.sx,
          right: '15%',
          left: 'auto',
        },
      })}
  </Box>
);

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.element,
};

export default SectionHeader;
