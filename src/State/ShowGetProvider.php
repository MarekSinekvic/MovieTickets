<?php

namespace App\State;

use ApiPlatform\Doctrine\Orm\State\CollectionProvider;
use ApiPlatform\Doctrine\Orm\State\ItemProvider;
use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use FileProcessor;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class ShowGetProvider implements ProviderInterface
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
            /** @var \App\Entity\Show[] */
            $shows = $this->collectionProvider->provide($operation,$uriVariables,$context);
            foreach ($shows as $show) {
                $show->getMovie()->getPreview()->setFile(FileProcessor::get($show->getMovie()->getPreview()->getUri())->getFile());
            }
            return $shows;
        } else {
            /** @var \App\Entity\Show */
            $show = $this->provider->provide($operation,$uriVariables,$context);
            $show->getMovie()->getPreview()->setFile(FileProcessor::get($show->getMovie()->getPreview()->getUri())->getFile());
            return $show;
        }
    }
}
