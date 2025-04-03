<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Repository\MediaRepository;
use App\State\MediaGetProvider;
use App\State\MediaPostProcessor;
use Doctrine\ORM\Mapping as ORM;
use FileProcessor;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;

// TODO: make get requests output format as multipart/form-data
#[ORM\Entity(repositoryClass: MediaRepository::class)]
#[ApiResource(
    operations: [
        new Get(provider: MediaGetProvider::class),
        new GetCollection(),
        new Post(processor: MediaPostProcessor::class, inputFormats: ['multipart' => ['multipart/form-data']])
    ],
    normalizationContext: ['groups' => ['media:read']],
    denormalizationContext: ['groups' => ['media:create']],
)]
class Media
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['media:create','media:read','show:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 2048)]
    #[Groups(['show:read','media:read'])]
    private ?string $uri = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $contentType = null;

    #[ORM\ManyToOne(inversedBy: 'media', cascade: ['remove'])]
    #[Groups(['media:create','media:read'])]
    private ?Movie $movie = null;
    #[Groups(['media:read','movie:read','show:read'])]
    private File $file;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUri(): ?string
    {
        return $this->uri;
    }

    public function setUri(string $uri): static
    {
        $this->uri = $uri;

        return $this;
    }

    public function getContentType(): ?string
    {
        return $this->contentType;
    }

    public function setContentType(?string $contentType): static
    {
        $this->contentType = $contentType;

        return $this;
    }

    public function getMovie(): ?Movie
    {
        return $this->movie;
    }

    public function setMovie(?Movie $movie): static
    {
        $this->movie = $movie;

        return $this;
    }
    public function getFile(): ?File
    {
        return $this->file;
    }

    public function setFile(?File $file): static
    {
        $this->file = $file;

        return $this;
    }
    public function uploadFile(?File $file, bool $copy = false): static {
        $processor = FileProcessor::upload($file, $copy);
        $this->setFile($file);
        $this->setContentType($processor->getMime());
        $this->setUri($processor->getName().'.'.$processor->getExtension());
        return $this;
    }
}
