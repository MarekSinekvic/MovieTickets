<?php

namespace App\Entity;

// use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use App\State\MovieGetProvider;
use Src\Filters\ArrayFilter;


use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\MovieRepository;
use App\State\MovieDeleteProcessor;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: MovieRepository::class)]
#[ApiResource(
    operations: [
        new Get(provider: MovieGetProvider::class),
        new GetCollection(paginationItemsPerPage: 20, paginationClientItemsPerPage:true, 
                        provider: MovieGetProvider::class),
        new Post(),
        new Patch(processor: MoviePatchProcessor::class),
        new Delete(processor: MovieDeleteProcessor::class)
    ],
    normalizationContext: ['groups' => ['movie:read']],
)]
#[ApiFilter(OrderFilter::class, properties: ['id','name'])]
#[ApiFilter(SearchFilter::class, properties: ['name' => 'partial', 'description' => 'partial'])]
#[ApiFilter(ArrayFilter::class, properties: ['tags'])]
class Movie
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['movie:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['show:read', 'movie:read','media:read','user:read','ticket:read'])]
    private ?string $name = null;

    #[ORM\OneToOne(mappedBy: 'movie', cascade: ['persist', 'remove'])]
    #[Groups(['movie:read','media:read'])]
    private ?Show $show = null;

    /**
     * @var Collection<int, Tag>
     */
    #[ORM\ManyToMany(targetEntity: Tag::class, mappedBy: 'movie')]
    #[Groups(['show:read','movie:read','media:read','user:read','ticket:read'])]
    private Collection $tags;

    #[ORM\OneToOne(cascade: ['persist'])]
    #[Groups(['show:read','movie:read','user:read','ticket:read'])]
    private ?Media $preview = null;

    /**
     * @var Collection<int, Media>
     */
    #[ORM\OneToMany(targetEntity: Media::class, mappedBy: 'movie', cascade: ['persist'])]
    #[Groups(['show:read','movie:read'])]
    private Collection $media;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['show:read','movie:read','media:read','ticket:read'])]
    private ?string $description = null;

    public function __construct()
    {
        $this->tags = new ArrayCollection();
        $this->media = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getShow(): ?Show
    {
        return $this->show;
    }

    public function setShow(Show $show): static
    {
        // set the owning side of the relation if necessary
        if ($show->getMovie() !== $this) {
            $show->setMovie($this);
        }

        $this->show = $show;

        return $this;
    }

    /**
     * @return Collection<int, Tag>
     */
    public function getTags(): Collection
    {
        return $this->tags;
    }

    public function addTag(Tag $tag): static
    {
        if (!$this->tags->contains($tag)) {
            $this->tags->add($tag);
            $tag->addMovie($this);
        }

        return $this;
    }

    public function removeTag(Tag $tag): static
    {
        if ($this->tags->removeElement($tag)) {
            $tag->removeMovie($this);
        }

        return $this;
    }

    public function getPreview(): ?Media
    {
        return $this->preview;
    }

    public function setPreview(?Media $preview): static
    {
        $this->preview = $preview;

        return $this;
    }

    /**
     * @return Collection<int, Media>
     */
    public function getMedia(): Collection
    {
        return $this->media;
    }

    public function addMedia(Media $media): static
    {
        if (!$this->media->contains($media)) {
            $this->media->add($media);
            $media->setMovie($this);
        }

        return $this;
    }

    public function removeMedia(Media $media): static
    {
        if ($this->media->removeElement($media)) {
            // set the owning side to null (unless already changed)
            if ($media->getMovie() === $this) {
                $media->setMovie(null);
            }
        }

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }
}
