<?php

namespace App\State;

use ApiPlatform\Doctrine\Orm\State\CollectionProvider;
use ApiPlatform\Doctrine\Orm\State\ItemProvider;
use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use FileProcessor;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class MovieGetProvider implements ProviderInterface
{
    public function __construct(
        #[Autowire(service: ItemProvider::class)]
        private ProviderInterface $provider,
        #[Autowire(service: CollectionProvider::class)]
        private ProviderInterface $collectionProvider
    )
    {}
    private array $data;
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        
        if ($operation instanceof CollectionOperationInterface) {
            /** @var \App\Entity\Movie[] */
            $movies = $this->collectionProvider->provide($operation,$uriVariables,$context);
            foreach ($movies as $movie) {
                $movie->getPreview()->setFile(FileProcessor::get($movie->getPreview()->getUri())->getFile());
            }
            return $movies;
        } else {
            /** @var \App\Entity\Movie */
            $movie = $this->provider->provide($operation,$uriVariables,$context);
            if (!$movie) return null;
                $movie->getPreview()->setFile(FileProcessor::get($movie->getPreview()->getUri())->getFile());
            return $movie;
        }
        
    }
}
