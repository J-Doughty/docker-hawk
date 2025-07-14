import { createFileRoute } from '@tanstack/react-router'
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
      <ExpandableTable columns={[
        { key: "dessert", displayName: "Dessert (100g serving)" },
        { key: "calories", displayName: "Calories", align: "right" },
        { key: "fat", displayName: <>Fat&nbsp;(g)</>, align: "right" },
        { key: "carbs", displayName: <>Carbs&nbsp;(g)</>, align: "right" },
        { key: "protein", displayName: <>Protein&nbsp;(g)</>, align: "right" },
        // { key: "price", displayName: <>Price&nbsp;(£)</> },
      ]}
        rows={[
          {
            rowValues: {
              dessert: "Frozen yoghurt",
              calories: 5,
              fat: 10,
              carbs: 186,
              protein: 15,
              // price: 14.58,
            },
            expandablePanel: <>Expanded</>
          },
          {
            rowValues: {
              dessert: "Frozen yoghurt",
              calories: 5,
              fat: 10,
              carbs: 186,
              protein: 15,
              // price: 14.58,
            },
            expandablePanel: <>Expanded</>
          },
        ]}
      />
    </section>
  )
}
