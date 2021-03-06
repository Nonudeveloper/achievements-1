import * as React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";

import Fab from "@material-ui/core/Fab";
import withStyles from "@material-ui/core/styles/withStyles";

import AddIcon from "@material-ui/icons/Add";

import { sagaInjector } from "../../services/saga";
import { sagas } from "./sagas";
import TasksTable from "../../components/tables/TasksTable";
import Breadcrumbs from "../../components/Breadcrumbs";
import {
  tasksDialogHide,
  tasksDeleteTaskDialogShow,
  tasksDeleteTaskRequest
} from "./actions";
import { push } from "connected-react-router";
import DeleteConfirmationDialog from "../../components/dialogs/DeleteConfirmationDialog";
import { firebaseConnect } from "react-redux-firebase";

const styles = () => ({
  fabButton: {
    position: "fixed",
    bottom: 24,
    right: 24
  }
});

class Tasks extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.shape({
      fabButton: PropTypes.string
    }),
    onPush: PropTypes.func,
    onTasksDeleteTaskDialogShow: PropTypes.func,
    onTasksDeleteTaskRequest: PropTypes.func,
    onTasksDialogHide: PropTypes.func,
    tasks: PropTypes.any,
    ui: PropTypes.any
  };
  state = {};

  onAddTaskClick = () => this.props.onPush("/tasks/new");
  onDeleteTaskClick = taskId => this.props.onTasksDeleteTaskDialogShow(taskId);

  render() {
    const { classes, tasks, ui } = this.props;

    return (
      <React.Fragment>
        <Breadcrumbs paths={[{ label: "Tasks" }]} />
        <TasksTable
          onDeleteClick={this.onDeleteTaskClick}
          tasks={tasks || {}}
        />
        <Fab
          className={classes.fabButton}
          color="primary"
          onClick={this.onAddTaskClick}
        >
          <AddIcon />
        </Fab>
        <DeleteConfirmationDialog
          message="This will remove Task"
          onClose={this.props.onTasksDialogHide}
          onCommit={this.props.onTasksDeleteTaskRequest}
          open={ui.dialogType === "DELETE_TASK"}
        />
      </React.Fragment>
    );
  }
}

sagaInjector.inject(sagas);

export default compose(
  firebaseConnect((ownProps, store) => {
    const state = store.getState();
    if (state.firebase.auth.isEmpty) {
      return [];
    }
    return [
      {
        path: "/tasks",
        storeAs: "tasks",
        queryParams: [
          "orderByChild=owner",
          "equalTo=" + state.firebase.auth.uid
        ]
      }
    ];
  }),
  connect(
    state => ({
      tasks: state.firebase.data.tasks,
      ui: state.tasks.ui
    }),
    {
      onPush: push,
      onTasksDeleteTaskDialogShow: tasksDeleteTaskDialogShow,
      onTasksDeleteTaskRequest: tasksDeleteTaskRequest,
      onTasksDialogHide: tasksDialogHide
    }
  ),
  withStyles(styles)
)(Tasks);
