import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import PropTypes from 'prop-types';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';


const QuestionTab = ({ game, onAddQuestion, onEditQuestion, onDeleteQuestion }) => {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: '#fff',
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          Questions
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAddQuestion}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Add Question
        </Button>
      </Box>

      {game?.questions.length === 0 ? (
        <Card sx={{ borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.9)' }}>
          <CardContent sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              No questions added yet
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={onAddQuestion}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Add Your First Question
            </Button>
          </CardContent>
        </Card>
      ) : (
        <List sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)', borderRadius: 3 }}>
          {game?.questions.map((question, index) => (
            <Box key={question.id || index}>
              {index > 0 && <Divider />}
              <ListItem
                sx={{
                  py: 2,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.03)',
                  },
                }}
                secondaryAction={
                  <Box sx={{ display: 'flex' }}>
                    <Tooltip title="Edit Question">
                      <IconButton
                        edge="end"
                        onClick={() => onEditQuestion(question)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Question">
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => onDeleteQuestion(question.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight={600}>
                      {index + 1}. {question.text}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="body2"
                        component="span"
                        color="text.secondary"
                        display="block"
                      >
                        Time limit: {question.timeLimit || 0}s •{' '}
                        {question.points || 0} points
                      </Typography>
                      <Typography
                        variant="body2"
                        component="span"
                        color="text.secondary"
                        display="block"
                      >
                        {question.answers
                          ? `${
                            question.answers.filter(
                              (a) => a.isCorrect
                            ).length
                          } correct answer(s) • ${
                            question.answers.length
                          } total options`
                          : 'No answer options defined'}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            </Box>
          ))}
        </List>
      )}
    </Box>
  );
};

export default QuestionTab;

QuestionTab.propTypes = {
  game: PropTypes.object.isRequired,
  onAddQuestion: PropTypes.func.isRequired,
  onEditQuestion: PropTypes.func.isRequired,
  onDeleteQuestion: PropTypes.func.isRequired
}; 