<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Show;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class ShowStateProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor,

    ) {}
    
    /**
     * @return Show|void
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        $result = $this->persistProcessor->process($data,$operation,$uriVariables,$context);
        
        // $result->setViews($result->getViews()+1);
        $result->setViews(1);
        return $data;
    }
}
