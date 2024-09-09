import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useState } from "react";
import { Ayats } from "../../Types/Stories";

interface Props {
  sectionTitle: string;
  columns: ColumnsType<Ayats>;
  list: Ayats[];
  handleSequenceChange: (ayats: any, title: string) => void;
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

const Row = (props: RowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    cursor: "move",
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  };

  return (
    <tr
      {...props}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    />
  );
};

const DragableTable: React.FC<Props> = ({
  sectionTitle,
  columns,
  list,
  handleSequenceChange,
}) => {
  const [dataSource, setDataSource] = useState<Ayats[]>([]);
  const [isDataSourcUpdated, setIsDataSourceUpdated] = useState<boolean>(false);

  React.useEffect(() => {
    if (list.length > 0) {
      let arr = [] as Ayats[];
      list.forEach((item, index) => {
        item = { ...item, key: index + 1 };
        arr.push(item);
      });
      setDataSource(arr);
    }
  }, [list]);

  React.useEffect(() => {
    if (isDataSourcUpdated) {
      handleSequenceChange(dataSource, sectionTitle);
      setIsDataSourceUpdated(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDataSourcUpdated]);

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((prev) => {
        const activeIndex = prev.findIndex((i) => i.key === active.id);
        const overIndex = prev.findIndex((i) => i.key === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
      setIsDataSourceUpdated(true);
    }
  };
  return (
    <DndContext onDragEnd={(e) => onDragEnd(e)}>
      <SortableContext
        // rowKey array
        items={dataSource.map((i) => i.key)}
        strategy={verticalListSortingStrategy}
      >
        <Table
          components={{
            body: {
              row: Row,
            },
          }}
          rowKey="key"
          columns={columns}
          dataSource={[...dataSource]}
          pagination={false}
        />
      </SortableContext>
    </DndContext>
  );
};

export default DragableTable;
