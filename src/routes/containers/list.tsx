import { createFileRoute, Link } from '@tanstack/react-router'
import { invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from 'react';
import { ContainerSummary } from '../../types/tauri/commands/docker/ContainerSummary';
import ExpandableTable from '../../components/shared/table/expandableTable';

export const Route = createFileRoute('/containers/list')({
  component: RouteComponent,
})

function RouteComponent() {
  const [containers, setContainers] = useState<ContainerSummary[]>();

  useEffect(() => {
    invoke<ContainerSummary[]>("list_containers").then(
      dockerContainers => setContainers(dockerContainers)
    );
  }, [])

  return (
    <section>
      <div>
        {containers && containers.flatMap(containers => (
          <p>{containers.Names}</p>
        ))}
      </div>
      {/* essert (100g serving)
                              Calories
                              Fat&nbsp;(g)
                              Carbs&nbsp;(g)
                              Protein&nbsp;(g) */}
      <ExpandableTable columns={[
        { key: "calories", displayName: "Calories" },
        { key: "fat", displayName: <>Fat&nbsp;(g)</> },
        { key: "carbs", displayName: <>Carbs&nbsp;(g)</> },
        { key: "protein", displayName: <>Protein&nbsp;(g)</> },
        { key: "price", displayName: <>Price&nbsp;(£)</> },
      ]}
        rows={[
          {
            calories: 5,
            fat: 10,
            carbs: 186,
            protein: 15,
            price: 14.58,
          }
        ]}
      />
    </section>
  )
}
