import { createFileRoute } from '@tanstack/react-router'
import { invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from 'react';
import { ContainerSummary } from '../../types/tauri/commands/docker/containerSummary';

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
    </section>
  )
}
