import { createFileRoute } from '@tanstack/react-router'
import { invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from 'react';
import { ImageSummary } from '../../types/tauri/commands/docker/ImageSummary';

export const Route = createFileRoute('/images/list')({
    component: RouteComponent,
})

function RouteComponent() {
    const [images, setImages] = useState<ImageSummary[]>();

    useEffect(() => {
        invoke<ImageSummary[]>("list_images").then(
            dockerImages => setImages(dockerImages)
        );
    }, [])

    return (
        <section>
            <div>
                {images && images.flatMap(image => (
                    <p>{image.RepoTags}</p>
                ))}
            </div>
        </section>
    )
}
