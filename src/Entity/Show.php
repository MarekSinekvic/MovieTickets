<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;

use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\ShowRepository;
use App\State\ShowGetProvider;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Src\Filters\ArrayFilter;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ShowRepository::class)]
#[ApiResource(
    paginationItemsPerPage: 20,
    paginationClientItemsPerPage:true,
    normalizationContext: ['groups' => ['show:read']],
    // denormalizationContext: ['groups' => ['show:write']]
    operations: [
        new Get(provider: ShowGetProvider::class),
        new GetCollection(provider: ShowGetProvider::class),
        new Post(),
        new Delete(),
        new Patch()
    ]
)]
#[ApiFilter(OrderFilter::class, properties: ['id','end_date','movie.name'])]
#[ApiFilter(DateFilter::class, properties: ['end_date'])]
#[ApiFilter(SearchFilter::class, properties: ['movie' => 'exact', 'movie.name' => 'partial'])]
#[ApiFilter(ArrayFilter::class, properties: ['movie.tags'])]
class Show
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['show:read','user:read'])]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'show', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['show:read','user:read', 'ticket:read'])]
    private ?Movie $movie = null;

    #[ORM\ManyToOne(inversedBy: 'shows')]
    #[Groups(['show:read','user:read', 'ticket:read'])]
    private ?Theater $theater = null;


    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['show:read','user:read', 'ticket:read'])]
    private ?\DateTimeInterface $begin_date = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['show:read','user:read', 'ticket:read'])]
    private ?\DateTimeInterface $end_date = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['show:read','show:update', 'ticket:read'])]
    private ?int $views = 0;

    /**
     * @var Collection<int, Ticket>
     */
    #[ORM\OneToMany(targetEntity: Ticket::class, mappedBy: 'show', orphanRemoval: true)]
    #[Groups(['show:read'])]
    private Collection $tickets;

    public function __construct()
    {
        $this->tickets = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMovie(): ?Movie
    {
        return $this->movie;
    }

    public function setMovie(Movie $movie): static
    {
        $this->movie = $movie;

        return $this;
    }

    public function getTheater(): ?Theater
    {
        return $this->theater;
    }

    public function setTheater(?Theater $theater): static
    {
        $this->theater = $theater;

        return $this;
    }

    public function getBeginDate(): ?\DateTimeInterface
    {
        return $this->begin_date;
    }

    public function setBeginDate(?\DateTimeInterface $begin_date): static
    {
        $this->begin_date = $begin_date;

        return $this;
    }

    public function getEndDate(): ?\DateTimeInterface
    {
        return $this->end_date;
    }

    public function setEndDate(?\DateTimeInterface $end_date): static
    {
        $this->end_date = $end_date;

        return $this;
    }

    public function getViews(): ?int
    {
        return $this->views;
    }

    public function setViews(?int $views): static
    {
        $this->views = $views;

        return $this;
    }

    /**
     * @return Collection<int, Ticket>
     */
    public function getTickets(): Collection
    {
        return $this->tickets;
    }

    public function addTicket(Ticket $ticket): static
    {
        if (!$this->tickets->contains($ticket)) {
            $this->tickets->add($ticket);
            $ticket->setShow($this);
        }

        return $this;
    }

    public function removeTicket(Ticket $ticket): static
    {
        if ($this->tickets->removeElement($ticket)) {
            // set the owning side to null (unless already changed)
            if ($ticket->getShow() === $this) {
                $ticket->setShow(null);
            }
        }

        return $this;
    }
}
