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

const Applications = () => {
  const [applicationStageColumns, setApplicationStageColumns] = useState<
    ApplicationStageType[]
  >([]);
  const [columnBeforeDragging, setColumnBeforeDragging] = useState<
    ApplicationStageType | null | undefined
  >(null);

  //the data of the item being dragged
  const [dragItemData, setDragItemData] = useState<any>(null);
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

  const moveCardBetweenDifferentColumns = (
    active: any,
    over: any,
    initialColumn: any,
    targetColumn: any,
    isOverColumn: boolean = false
  ) => {
    //update application stages
    setApplicationStageColumns((prev) => {
      const newApplicationStages = [...prev];

      const newInitialColumn = newApplicationStages.find(
        (stage) => stage.id === initialColumn.id
      );
      const newTargetColumn = newApplicationStages.find(
        (stage) => stage.id === targetColumn.id
      );
      if (!newInitialColumn || !newTargetColumn) return prev;

      // console.log(newInitialColumn, newTargetColumn);

      //TODO: fix case when dragging to an empty column (over is a column, not a job)
      let overJobIndex = -1;
      let newJobIndex: number = -1;

      //when dragging to an empty column
      if (isOverColumn) {
        //check if the index is 0 or last
        if (
          newTargetColumn.jobs.length === 0 ||
          active.rect.current.translated.top < over.rect.top
        ) {
          newJobIndex = 0;
        } else if (active.rect.current.translated.bottom > over.rect.bottom) {
          console.log("hereeee");

          newJobIndex = newTargetColumn.jobs.length;
        }
        //when dragging to a column with jobs
      } else {
        overJobIndex = newTargetColumn.jobs.findIndex(
          (job) => job.id === parseInt(over.id.split("-")[1])
        );

        if (overJobIndex === -1) return prev;

        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;
        const modifier = isBelowOverItem ? 1 : 0;
        newJobIndex =
          overJobIndex >= 0
            ? overJobIndex + modifier
            : targetColumn.jobs.length + 1;
      }

      if (newJobIndex === -1) return prev;

      // console.log(active.rect.current.translated, over.rect);

      // console.log("overJobIndex: " + overJobIndex);
      console.log("newJobIndex: " + newJobIndex);

      //remove job from the old column
      if (newInitialColumn) {
        newInitialColumn.jobs = newInitialColumn.jobs.filter(
          (job) => job.id !== parseInt(active.id.split("-")[1])
        );
        // console.log(newInitialColumn);
      }

      //add dragged job to the new column
      if (newTargetColumn) {
        newTargetColumn.jobs = newTargetColumn.jobs.filter(
          (job) => job.id !== parseInt(active.id.split("-")[1])
        );
        newTargetColumn.jobs.splice(newJobIndex, 0, {
          id: parseInt(dragItemData.id.split("-")[1]),
          title: dragItemData.title,
          company: dragItemData.company,
          stageId: newTargetColumn.id,
        });
        // console.log(newTargetColumn);
      }
      // console.log(newApplicationStages);

      return newApplicationStages;
    });
  };

  const handleDragStart = (e: any) => {
    //stores the data of the item being dragged
    // console.log(e.active.data.current);
    setDragItemData(e.active.data.current);

    //if we're dragging a job card -> set the column before dragging to remember the prev col
    if (e?.active?.data?.current?.type === "job") {
      setColumnBeforeDragging(findColumnByJobId(e.active.data.current.id));
    }
  };

  const handleDragOver = (e: any) => {
    //only allow drag and drop job card
    if (dragItemData?.type === "applicationStage") {
      return;
    }
    //get the active and over data card
    const { active, over } = e;
    if (!over) return;
    if (
      active.data.current.type === over.data.current.type &&
      active.id === over.id
    )
      return;
    let isOverColumn = over.data.current.type === "applicationStage";
    //find 2 columns corresponding to the active and over data card
    const initialColumn = findColumnByJobId(active.id);
    const targetColumn = isOverColumn
      ? findColumnByStageId(over.id)
      : findColumnByJobId(over.id);
    if (!initialColumn || !targetColumn) return;
    // console.log(initialColumn, targetColumn);
    if (initialColumn.id === targetColumn.id) {
      console.log("handleDragOver: same column!");
      return;
    }
    // if (isOverColumn && targetColumn.jobs.length > 0) {
    //   console.log("can't drop here");
    //   return;
    // }
    //update application stages
    moveCardBetweenDifferentColumns(
      active,
      over,
      initialColumn,
      targetColumn,
      isOverColumn
    );
  };

  const handleDragEnd = (e: any) => {
    console.log(e);
    const { active, over } = e;
    console.log(active, over);
    if (!over || !active) return;

    // console.log(active.data, over.data);

    if (dragItemData?.type === "job") {
      //can't use active because the active time has been changed in the handleDragOver function, need to use columnBeforeDragging
      //find column where the data card is dragged to
      let isOverColumn = over.data.current.type === "applicationStage";
      const targetColumn = isOverColumn
        ? findColumnByStageId(over.id)
        : findColumnByJobId(over.id);
      console.log(columnBeforeDragging, targetColumn);
      if (!columnBeforeDragging || !targetColumn) return;
      //if drag and drop in the same column
      if (columnBeforeDragging.id === targetColumn.id) {
        console.log("dragend: same column");
        //find the old and new index of the active job
        const oldJobIndex = columnBeforeDragging.jobs.findIndex(
          (job) => job.id === parseInt(dragItemData.id.split("-")[1])
        );
        let newJobIndex = -1;
        if (isOverColumn) {
          console.log("dragend: isOverColumn");
          console.log(active);
          //check if the index is 0 or last
          if (active.rect.current.translated.top < over.rect.top) {
            newJobIndex = 0;
          } else if (active.rect.current.translated.bottom > over.rect.bottom) {
            newJobIndex = targetColumn.jobs.length;
            console.log("thiss");
          }
        } else {
          newJobIndex = targetColumn.jobs.findIndex(
            (job) => job.id === parseInt(over.id.split("-")[1])
          );
        }
        if (oldJobIndex === -1 || newJobIndex === -1) return;
        const newOrderedJobList = arrayMove(
          targetColumn.jobs,
          oldJobIndex,
          newJobIndex
        );
        console.log(newOrderedJobList);
        //update application stages
        setApplicationStageColumns((prev) => {
          //find the application stage col (before being dragged) that contains the dragged job
          const newApplicationStagesColumns = [...prev];
          const applicationStageColumn = newApplicationStagesColumns.find(
            (stage) => stage.id === targetColumn.id
          );
          if (!applicationStageColumn) return prev;
          console.log(applicationStageColumn);
          //update the active application stage
          applicationStageColumn.jobs = newOrderedJobList;
          return newApplicationStagesColumns;
        });
      } else {
        console.log("dragend: different column");

        // if (isOverColumn && targetColumn.jobs.length > 0) {
        //   console.log("can't drop here");
        //   return;
        // }

        //update application stages
        moveCardBetweenDifferentColumns(
          active,
          over,
          columnBeforeDragging,
          targetColumn,
          isOverColumn
        );
      }
    } else if (dragItemData?.type === "applicationStage") {
      if (active.data.current.type !== over.data.current.type) {
        console.log("not the same type");
        return;
      }
      if (active.id === over.id) return;
      setApplicationStageColumns((prev) => {
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
    //clear data
    setDragItemData(null);
    setColumnBeforeDragging(null);
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
                {dragItemData?.type === "applicationStage" && (
                  <ApplicationStageColumn
                    id={dragItemData.id}
                    name={dragItemData.name}
                    jobs={dragItemData.jobs}
                    jobOrderIds={dragItemData.jobOrderIds}
                  />
                )}
                {dragItemData?.type === "job" && (
                  <JobCard
                    id={dragItemData.id}
                    title={dragItemData.title}
                    company={dragItemData.company}
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
