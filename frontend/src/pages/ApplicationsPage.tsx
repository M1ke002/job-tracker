import React, { useEffect, useState } from "react";
import ApplicationStageColumn from "@/components/application/ApplicationStageColumn";
import ApplicationStage from "@/components/application/ApplicationStage";
import { Plus } from "lucide-react";
import {
  DndContext,
  useDroppable,
  DragOverlay,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
  DropAnimation,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import JobCard from "@/components/application/JobCard";
import ApplicationStageType from "@/types/ApplicationStage";
import axios from "@/lib/axiosConfig";
import { getApplicationStatusCount } from "@/utils/utils";
import SavedJob from "@/types/SavedJob";

const sortStagesByPosition = (
  applicationStageColumns: ApplicationStageType[]
) => {
  return applicationStageColumns.sort((a, b) => a.position - b.position);
};

const sortJobsByPosition = (jobs: SavedJob[]) => {
  return jobs.sort((a, b) => a.position - b.position);
};

const ApplicationsPage = () => {
  const [applicationStageColumns, setApplicationStageColumns] = useState<
    ApplicationStageType[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //the data of the item being dragged
  const [activeColumnData, setActiveColumnData] =
    useState<ApplicationStageType | null>(null);
  const [activeCardData, setActiveCardData] = useState<SavedJob | null>(null);

  //set the initial and target column id when dragging a job card
  const [initialJobColumnId, setInitialJobColumnId] = useState<string>("");
  const [targetJobColumnId, setTargetJobColumnId] = useState<string>("");

  const { setNodeRef } = useDroppable({
    id: `application-stages`,
  });

  useEffect(() => {
    const fetchApplicationStages = async () => {
      try {
        const res = await axios.get("/application-stages");
        const orderedStages = sortStagesByPosition(res.data);
        //sort jobs by position
        orderedStages.forEach((stage) => {
          stage.jobs = sortJobsByPosition(stage.jobs);
        });
        setApplicationStageColumns(orderedStages);
      } catch (error) {
        console.log(error);
      }
    };
    fetchApplicationStages();
  }, []);

  const pointerSensor = useSensor(PointerSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const updateStageOrder = async (newStageColumns: ApplicationStageType[]) => {
    try {
      //send an array of [{id: 1, position: 0}, {id: 2, position: 1}, ...]
      const stagePositions = newStageColumns.map((stage) => ({
        id: stage.id,
        position: stage.position,
      }));
      console.log(stagePositions);
      const res = await axios.put("/application-stages/reorder-stages", {
        stagePositions,
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateJobOrder = async (affectedStages: ApplicationStageType[]) => {
    try {
      //send an array of jobs [{id: 1, stage_id: 1, position: 0}, {id: 2, stage_id: 1, position: 1}, ...]
      const jobPositions: {
        id: number;
        stage_id: number;
        position: number;
      }[] = [];
      affectedStages.forEach((stage) => {
        stage.jobs.forEach((job, index) => {
          jobPositions.push({
            id: job.id,
            stage_id: stage.id,
            position: index,
          });
        });
      });
      console.log(jobPositions);
      const res = await axios.put("/saved-jobs/reorder-jobs", {
        jobPositions,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const removeJobFromStages = async (jobId: number) => {
    try {
      //find the column that contains the job
      const column = findColumnByJobId(jobId);
      if (!column) return;

      //remove the job from the column
      column.jobs = column.jobs.filter((job) => job.id !== jobId);

      //update the position of jobs
      column.jobs = column.jobs.map((job, index) => ({
        ...job,
        position: index,
      }));

      setApplicationStageColumns((prev) => {
        const newColumns = [...prev];
        const index = newColumns.findIndex((stage) => stage.id === column.id);
        newColumns[index] = column;
        return newColumns;
      });

      //send an array of [{id: 1, position: 0}, {id: 2, position: 1}, ...]: positions of the remaining jobs in the column
      const jobPositions = column.jobs.map((job) => ({
        id: job.id,
        position: job.position,
      }));

      const res = await axios.put(`/saved-jobs/${jobId}/remove-stage`, {
        jobPositions,
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  const findColumnByJobId = (jobId: number) => {
    console.log(applicationStageColumns, jobId);
    const column = applicationStageColumns.find((stage) =>
      stage.jobs.map((job) => job.id).includes(jobId)
    );
    console.log(column);

    return column;
  };

  const findColumnByStageId = (stageId: string) => {
    const column = applicationStageColumns.find(
      (stage) => stage.id === parseInt(stageId)
    );
    return column;
  };

  const handleDragStart = (e: any) => {
    //stores the data of the item being dragged

    if (e?.active?.data?.current?.type === "job") {
      setActiveCardData(e.active.data.current);
      console.log(e.active.data.current);
    } else if (e?.active?.data?.current?.type === "applicationStage") {
      setActiveColumnData(e.active.data.current);
    }
  };

  const handleDragOver = (e: any) => {
    const { active, over } = e;
    if (!over) return;
    if (active.id === over.id) return;

    const isActiveACard = active.data.current?.type === "job";
    const isOverACard = over.data.current?.type === "job";

    //only handle case when dragging a job card, not a column
    if (!isActiveACard) return;

    //CASE: dragging a job card over another job card
    if (isActiveACard && isOverACard) {
      setApplicationStageColumns((applicationStageColumns) => {
        //get the column of the active and over job card
        const initialColumn = applicationStageColumns.find((stage) =>
          stage.jobs
            .map((job) => job.id)
            .includes(parseInt(active.id.split("-")[1]))
        );
        const targetColumn = applicationStageColumns.find((stage) =>
          stage.jobs
            .map((job) => job.id)
            .includes(parseInt(over.id.split("-")[1]))
        );

        if (!initialColumn || !targetColumn) return applicationStageColumns;

        //set the initial and target column id
        setInitialJobColumnId(initialColumn.id.toString());
        setTargetJobColumnId(targetColumn.id.toString());

        const activeIndex = initialColumn.jobs.findIndex(
          (job) => job.id === parseInt(active.id.split("-")[1])
        );
        const overIndex = targetColumn.jobs.findIndex(
          (job) => job.id === parseInt(over.id.split("-")[1])
        );

        if (activeIndex === -1 || overIndex === -1)
          return applicationStageColumns;

        //dragging in different column
        if (initialColumn.id !== targetColumn.id) {
          //remove the active job from the old column
          initialColumn.jobs = initialColumn.jobs.filter(
            (job) => job.id !== parseInt(active.id.split("-")[1])
          );

          //add the active job to the new column
          targetColumn.jobs = targetColumn.jobs.filter(
            (job) => job.id !== parseInt(active.id.split("-")[1])
          );
          targetColumn.jobs.splice(overIndex, 0, {
            ...active.data.current,
            id: parseInt(active.id.split("-")[1]),
            stage_id: targetColumn.id,
          });

          //update the position of jobs
          initialColumn.jobs = initialColumn.jobs.map((job, index) => ({
            ...job,
            stage_id: initialColumn.id,
            stage: initialColumn,
            position: index,
          }));
          targetColumn.jobs = targetColumn.jobs.map((job, index) => ({
            ...job,
            stage_id: targetColumn.id,
            stage: targetColumn,
            position: index,
          }));

          return [...applicationStageColumns];
        }

        //dragging in the same column -> only reorder the jobs
        const newOrderedJobList = arrayMove(
          targetColumn.jobs,
          activeIndex,
          overIndex
        );

        //update the active application stage
        initialColumn.jobs = newOrderedJobList;

        //update the position of jobs
        initialColumn.jobs = initialColumn.jobs.map((job, index) => ({
          ...job,
          position: index,
        }));

        return [...applicationStageColumns];
      });
    }

    const isOverAColumn = over.data.current?.type === "applicationStage";
    //CASE: dragging a job card over a column
    if (isActiveACard && isOverAColumn) {
      setApplicationStageColumns((applicationStageColumns) => {
        //get the column of the active and over job card
        const initialColumn = applicationStageColumns.find((stage) =>
          stage.jobs
            .map((job) => job.id)
            .includes(parseInt(active.id.split("-")[1]))
        );

        const targetColumn = applicationStageColumns.find(
          (stage) => stage.id === parseInt(over.id.split("-")[1])
        );

        if (!initialColumn || !targetColumn) return applicationStageColumns;

        //set the initial and target column id
        setInitialJobColumnId(initialColumn.id.toString());
        setTargetJobColumnId(targetColumn.id.toString());

        const activeIndex = initialColumn.jobs.findIndex(
          (job) => job.id === parseInt(active.id.split("-")[1])
        );

        if (activeIndex === -1) return applicationStageColumns;

        //dragging in different column
        if (initialColumn.id !== targetColumn.id) {
          //remove the active job from the old column
          initialColumn.jobs = initialColumn.jobs.filter(
            (job) => job.id !== parseInt(active.id.split("-")[1])
          );

          //add the active job to the new column
          targetColumn.jobs = targetColumn.jobs.filter(
            (job) => job.id !== parseInt(active.id.split("-")[1])
          );

          if (targetColumn.jobs.length === 0) {
            targetColumn.jobs.push({
              ...active.data.current,
              id: parseInt(active.id.split("-")[1]),
              stage_id: targetColumn.id,
            });
          } else {
            //check if the user is dragging the job card to the top or bottom of the column

            //dragging to the top of the column
            if (active.rect.current.translated.top <= over.rect.top) {
              console.log("top!");
              targetColumn.jobs.splice(0, 0, {
                ...active.data.current,
                id: parseInt(active.id.split("-")[1]),
                stage_id: targetColumn.id,
              });
            } else {
              //dragging to the bottom of the column
              targetColumn.jobs.push({
                ...active.data.current,
                id: parseInt(active.id.split("-")[1]),
                stageId: targetColumn.id,
              });
            }
          }

          //update the position of jobs
          initialColumn.jobs = initialColumn.jobs.map((job, index) => ({
            ...job,
            stage_id: initialColumn.id,
            stage: initialColumn,
            position: index,
          }));
          targetColumn.jobs = targetColumn.jobs.map((job, index) => ({
            ...job,
            stage_id: targetColumn.id,
            stage: targetColumn,
            position: index,
          }));

          return [...applicationStageColumns];
        }

        //dragging in the same column -> only reorder the jobs
        const newOrderedJobList = arrayMove(
          targetColumn.jobs,
          activeIndex,
          activeIndex
        );

        //update the active application stage
        initialColumn.jobs = newOrderedJobList;

        //update the position of jobs
        initialColumn.jobs = initialColumn.jobs.map((job, index) => ({
          ...job,
          position: index,
        }));

        return [...applicationStageColumns];
      });
    }
  };

  const handleDragEnd = async (e: any) => {
    //clear previous data
    setActiveColumnData(null);
    setActiveCardData(null);
    setInitialJobColumnId("");
    setTargetJobColumnId("");

    const { active, over } = e;
    console.log(active, over);

    if (!over || !active) return;

    if (activeCardData) {
      //get the initial and target column
      const initialColumn = findColumnByStageId(initialJobColumnId);
      const targetColumn = findColumnByStageId(targetJobColumnId);

      if (!initialColumn || !targetColumn) return;

      // console.log(initialColumn, targetColumn);

      const affectedStages = [initialColumn];
      //if the user is dragging the job card to a different column
      if (initialColumn.id !== targetColumn.id)
        affectedStages.push(targetColumn);

      await updateJobOrder(affectedStages);
    } else if (activeColumnData) {
      if (active.data.current.type !== over.data.current.type) {
        console.log("not the same type");
        return;
      }
      if (active.id === over.id) return;

      const oldIndex = applicationStageColumns.findIndex(
        (stage) => stage.id.toString() === active.id.split("-")[1]
      );
      const newIndex = applicationStageColumns.findIndex(
        (stage) => stage.id.toString() === over.id.split("-")[1]
      );

      if (oldIndex === -1 || newIndex === -1) return;

      //reorder application stages
      let reorderedColumns = arrayMove(
        applicationStageColumns,
        oldIndex,
        newIndex
      );

      //update the position of the application stages
      reorderedColumns = reorderedColumns.map((stage, index) => ({
        ...stage,
        position: index,
      }));
      setApplicationStageColumns(reorderedColumns);

      //call api
      await updateStageOrder(reorderedColumns);
    }
  };

  return (
    <div className="bg-[#f7fafc]">
      <div className="border-[#dce6f8] border-b-[1px] bg-white">
        <div className="flex items-center justify-between max-w-[1450px] px-4 mx-auto py-2 overflow-y-auto h-[100px]">
          {getApplicationStatusCount(applicationStageColumns).map(
            (status, index) => (
              <ApplicationStage
                key={index}
                stage={status.name}
                count={status.count}
              />
            )
          )}
        </div>
      </div>
      <div className="overflow-x-auto h-[calc(100vh-60px-101px)]">
        <DndContext
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          // collisionDetection={closestCenter}
          sensors={sensors}
        >
          <SortableContext
            items={applicationStageColumns.map((stage) => `stage-${stage.id}`)}
            strategy={horizontalListSortingStrategy}
          >
            <div
              ref={setNodeRef}
              className=" mx-auto flex items-start mt-5 max-w-[1450px]"
            >
              {applicationStageColumns.map((stage, index) => (
                <ApplicationStageColumn
                  key={stage.id}
                  id={stage.id}
                  stage_name={stage.stage_name}
                  jobs={stage.jobs}
                  removeJobFromStages={removeJobFromStages}
                />
              ))}
              <DragOverlay dropAnimation={dropAnimation}>
                {activeColumnData && (
                  <ApplicationStageColumn
                    id={activeColumnData.id}
                    stage_name={activeColumnData.stage_name}
                    jobs={activeColumnData.jobs}
                    removeJobFromStages={removeJobFromStages}
                  />
                )}
                {activeCardData && (
                  <JobCard
                    job={activeCardData}
                    removeJobFromStages={removeJobFromStages}
                  />
                )}
              </DragOverlay>
              {/* Add btn */}
              {/* <div className="px-3 mb-auto">
                <button className="flex items-center p-3 w-[250px] rounded-lg bg-[#fff] shadow-md border-[1px] border-[#c3dafe] hover:border-blue-400">
                  <Plus size={20} className="mr-2" />
                  <span className="text-sm font-medium text-[#3d3d3d]">
                    Add Stage
                  </span>
                </button>
              </div> */}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default ApplicationsPage;
