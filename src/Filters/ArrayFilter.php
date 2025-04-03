<?php

namespace Src\Filters;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Filter\FilterInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\ORM\QueryBuilder;

class ArrayFilter extends AbstractFilter
{
    // public function __construct()
    public function getDescription(string $resourceClass): array
    {
        $description = [];
        $properties = $this->getProperties();
        
        foreach ($properties as $property => $unused) {
            if (!$this->isPropertyMapped($property, $resourceClass, true))
                continue;
            
            $propertyName = $this->normalizePropertyName($property);
            $description[$propertyName] = [
                'property' => $propertyName,
                'type' => 'array',
                'required' => false,
            ];
        }

        return $description;
    }
    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?Operation $operation = null, array $context = []): void
    {
        
        // parse_str($value, $value);
        if ($value === null || !is_array($value)
            || !$this->isPropertyEnabled($property, $resourceClass)
            || !$this->isPropertyMapped($property, $resourceClass, true)) return;
        
        $alias = $queryBuilder->getRootAliases()[0];
        $field = $property;

        if ($this->isPropertyNested($property, $resourceClass)) {
            [$alias, $field] = $this->addJoinsForNestedProperty($property, $alias, $queryBuilder, $queryNameGenerator, $resourceClass, Join::INNER_JOIN);
        }

        foreach ($value as $tag) {
            $tag = intval($tag);
            $valueParameter = $queryNameGenerator->generateParameterName($field);
            $queryBuilder
                ->andWhere(\sprintf(':%s MEMBER OF %s.%s', $valueParameter, $alias, $field))
                ->setParameter($valueParameter, $tag);
        }
    }
}