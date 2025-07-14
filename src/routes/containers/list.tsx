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
        { name: "Calories" },
        { name: "Fat", displayName: <>Fat&nbsp;(g)</> },
        { name: "Carbs", displayName: <>Carbs&nbsp;(g)</> },
        { name: "Protein", displayName: <>Protein&nbsp;(g)</> },
        { name: "Price", displayName: <>Price&nbsp;(£)</> },
      ]}
        rows={[
          {
            Calories: 5,
            Fat: 10,
            Carbs: 186,
            Protein: 15,
            Price: 14.58,
          }
        ]}
      />
    </section>
  )
}
