<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Doctrine\Orm\Filter\NumericFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Repository\TicketRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: TicketRepository::class)]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
        new Post()
    ],
    normalizationContext: [
        'groups' => ['ticket:read']
    ],
    denormalizationContext: [
        'groups' => ['ticket:post']
    ],
)]
#[ApiFilter(SearchFilter::class, properties: ['client.uuid'=>'partial', 'show.movie.name'=>'partial'])]
#[ApiFilter(NumericFilter::class, properties: ['id'])]
class Ticket
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['ticket:read'])]
    private ?int $id = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['user:read','ticket:read'])]
    private ?int $seat = null;

    #[ORM\ManyToOne(inversedBy: 'tickets')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['ticket:read'])]
    private ?User $client = null;

    #[ORM\ManyToOne(inversedBy: 'tickets')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['user:read', 'ticket:read'])]
    private ?Show $show = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSeat(): ?int
    {
        return $this->seat;
    }

    public function setSeat(?int $seat): static
    {
        $this->seat = $seat;

        return $this;
    }

    public function getClient(): ?user
    {
        return $this->client;
    }

    public function setClient(?user $client): static
    {
        $this->client = $client;

        return $this;
    }

    public function getShow(): ?show
    {
        return $this->show;
    }

    public function setShow(?show $show): static
    {
        $this->show = $show;

        return $this;
    }
}
