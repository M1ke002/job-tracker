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

import { applicationData } from "@/components/fake-data/constant";
import JobCard from "@/components/application/JobCard";
import ApplicationStageType from "@/types/ApplicationStage";
import Job from "@/types/Job";

const Applications = () => {
  const [applicationStageColumns, setApplicationStageColumns] = useState<
    ApplicationStageType[]
  >([]);

  //the data of the item being dragged
  const [activeColumnData, setActiveColumnData] =
    useState<ApplicationStageType | null>(null);
  const [activeCardData, setActiveCardData] = useState<Job | null>(null);

  const { setNodeRef } = useDroppable({
    id: `application-stages`,
  });

  useEffect(() => {
    setApplicationStageColumns(applicationData.applicationStages);
  }, []);

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

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

  const findColumnByJobId = (jobId: string) => {
    console.log(applicationStageColumns, jobId);
    const column = applicationStageColumns.find((stage) =>
      stage.jobs.map((job) => job.id).includes(parseInt(jobId.split("-")[1]))
    );
    console.log(column);

    return column;
  };

  const findColumnByStageId = (stageId: string) => {
    const column = applicationStageColumns.find(
      (stage) => stage.id === parseInt(stageId.split("-")[1])
    );
    return column;
  };

  const handleDragStart = (e: any) => {
    //stores the data of the item being dragged

    if (e?.active?.data?.current?.type === "job") {
      setActiveCardData(e.active.data.current);
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
            id: parseInt(active.id.split("-")[1]),
            title: active.data.current.title,
            company: active.data.current.company,
            stageId: targetColumn.id,
          });

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
              id: parseInt(active.id.split("-")[1]),
              title: active.data.current.title,
              company: active.data.current.company,
              stageId: targetColumn.id,
            });
          } else {
            //check if the user is dragging the job card to the top or bottom of the column

            //dragging to the top of the column
            if (active.rect.current.translated.top <= over.rect.top) {
              console.log("top!");
              targetColumn.jobs.splice(0, 0, {
                id: parseInt(active.id.split("-")[1]),
                title: active.data.current.title,
                company: active.data.current.company,
                stageId: targetColumn.id,
              });
            } else {
              //dragging to the bottom of the column
              targetColumn.jobs.push({
                id: parseInt(active.id.split("-")[1]),
                title: active.data.current.title,
                company: active.data.current.company,
                stageId: targetColumn.id,
              });
            }
          }

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

        return [...applicationStageColumns];
      });
    }
  };

  const handleDragEnd = (e: any) => {
    //clear previous data
    setActiveColumnData(null);
    setActiveCardData(null);

    const { active, over } = e;
    console.log(active, over);

    if (!over || !active) return;

    if (activeCardData) {
      //TODO: call api to update the job order
      console.log("card data");
    } else if (activeColumnData) {
      if (active.data.current.type !== over.data.current.type) {
        console.log("not the same type");
        return;
      }
      if (active.id === over.id) return;
      setApplicationStageColumns((prev) => {
        //find old and new index of the column
        const oldIndex = prev.findIndex(
          (stage) => stage.id.toString() === active.id.split("-")[1]
        );
        const newIndex = prev.findIndex(
          (stage) => stage.id.toString() === over.id.split("-")[1]
        );

        if (oldIndex === -1 || newIndex === -1) return prev;
        console.log("test: " + oldIndex, newIndex);
        //reorder application stages
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="bg-[#f7fafc]">
      <div className="border-[#dce6f8] border-b-[1px] bg-white">
        <div className="flex items-center justify-between max-w-[1450px] px-4 mx-auto py-2 overflow-y-auto h-[100px]">
          <ApplicationStage stage="Applied" count={3} />
          <ApplicationStage stage="Interview" count={1} />
          <ApplicationStage stage="Offer" count={0} />
          <ApplicationStage stage="Rejected" count={0} />

          <button className="flex items-center justify-center bg-[#f1f6fa] min-w-[150px] h-[64px] text-sm tracking-wider uppercase border-[1px] border-[#c3dafe] font-semibold text-[#3d3d3d] px-3 py-2 mr-2 hover:border-blue-400">
            <Plus size={20} className="mr-2" />
            <span>Add Status</span>
          </button>
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
                  name={stage.name}
                  jobOrderIds={stage.jobOrderIds}
                  jobs={stage.jobs}
                />
              ))}
              <DragOverlay dropAnimation={dropAnimation}>
                {activeColumnData && (
                  <ApplicationStageColumn
                    id={activeColumnData.id}
                    name={activeColumnData.name}
                    jobs={activeColumnData.jobs}
                    jobOrderIds={activeColumnData.jobOrderIds}
                  />
                )}
                {activeCardData && (
                  <JobCard
                    id={activeCardData.id}
                    title={activeCardData.title}
                    company={activeCardData.company}
                  />
                )}
              </DragOverlay>
              {/* Add btn */}
              <div className="px-3 mb-auto">
                <button className="flex items-center p-3 w-[250px] rounded-lg bg-[#fff] shadow-md border-[1px] border-[#c3dafe] hover:border-blue-400">
                  <Plus size={20} className="mr-2" />
                  <span className="text-sm font-medium text-[#3d3d3d]">
                    Add Stage
                  </span>
                </button>
              </div>
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default Applications;
